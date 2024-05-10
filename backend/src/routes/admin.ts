import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Admin, Course, Instructor, Lecture } from "../db"
import { API_KEY, API_SECRET, CLOUD_NAME, jwt_secret } from "../config"
import { adminAuthMiddleware } from "./middleware"
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { UploadedFile } from 'express-fileupload'

const router = express.Router()

router.post("/signup", async(req:Request, res: Response) => {

    const username = req.body.username
    const password = req.body.password

    const existing = await Admin.findOne({username})
    if(existing) {
        return res.status(411).json({
            message: "username already taken"
        })
    }

    const admin = new Admin({
        username,
        password
    })

    await admin.save()

    const adminId = admin._id

    const token = jwt.sign({
        adminId: adminId,
        type: "admin",
    }, jwt_secret)

    return res.status(201).json({
        message: "admin created",
        token: token
    })
})

router.post("/signin", async(req: Request, res: Response) => {
    const username = req.body.username
    const password = req.body.password

    const admin = await Admin.findOne({
        username,
        password
    })

    if(admin) {
        const adminId = admin._id

        const token = jwt.sign({
            adminId: adminId,
            type: "admin",
        }, jwt_secret)

        return res.status(200).json({
            message: "signed in",
            token: token
        })
    } else {
        res.status(411).json({
            message: "Error while logging in"
        })
    }

})

router.post("/course", adminAuthMiddleware , async(req: Request, res: Response) => {
    const {name, level, description, image, lectures} = req.body

    if (!name || !level || !description || !image) {
        return res.status(400).json({
            message: 'All fields are required: name, level, description, and image',
        })
    }

    const newCourse = new Course({
        name,
        level,
        description,
        image,
    })

    if (lectures && lectures.length > 0) {

        for (const lecture of lectures) {

            const { instructor, date } = lecture;

            if (!instructor || !date) {
                return res.status(400).json({
                    message: 'Each lecture must have an instructor and date',
                })
            }

            const existingLecture = await Lecture.findOne({
                instructor,
                date,
            })

            if (existingLecture) {
                for(const lecture of newCourse.lectures) {
                    await Lecture.deleteOne({
                        _id: lecture
                    })
                }

                const name = await Instructor.findById(instructor)

                return res.status(409).json({
                    message: `${name?.username || "user"} already has a lecture scheduled on ${date}`,
                })
            }

            const newLecture = new Lecture({
                course: newCourse._id,
                instructor,
                date,
            })

            await newLecture.save();

            newCourse.lectures.push(newLecture._id);
        }

    }

    const savedCourse = await newCourse.save()

    res.status(201).json({
        message: 'Course created successfully',
        course: savedCourse,
    })
})

router.delete("/course/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
     const courseId = req.params.id;

    const course = await Course.findById(courseId);

    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }

    if (course.lectures && course.lectures.length > 0) {
        await Lecture.deleteMany({ _id: { $in: course.lectures } });
    }

    await Course.deleteOne({ _id: courseId });

    res.status(200).json({ message: "Course deleted successfully" })
})

router.post("/lecture", adminAuthMiddleware, async(req: Request, res: Response) => {
    const {courseId, instructor, date} = req.body

    if(!instructor.length || !date.length) {
        return res.status(409).json({
            message: `select date and instructor`,
        })
    }

    const existingLecture = await Lecture.findOne({
        instructor,
        date,
    })

    if (existingLecture) {
        return res.status(409).json({
            message: `Instructor already has a lecture scheduled on ${date}`,
        })
    }

    const course = await Course.findById(courseId)

    if(!course) {
        return res.status(404).json({
            message: "course not found"
        })
    }

    const newLecture = new Lecture({
        course: courseId,
        instructor,
        date,
    })

    course.lectures.push(newLecture._id)

    await course.save()
    const savedLecture = await newLecture.save()

    res.status(201).json({
        message: "lecture added",
        lecture: savedLecture
    })
})

router.get("/course/:id", adminAuthMiddleware, async (req: Request, res: Response) => {
    const courseId = req.params.id
    const course = await Course.findById(courseId)

    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }

    res.status(200).json({
        course,
    })
});

router.get("/courses", adminAuthMiddleware , async(req: Request, res: Response) => {

    const courses = await Course.find({})

    res.status(200).json({
        courses
    })
})

router.get("/lectures", adminAuthMiddleware, async(req: Request, res: Response) => {
    const lectures = await Lecture.find({})

    res.status(200).json({
        lectures
    })
})

router.get("/instructors", adminAuthMiddleware, async(req: Request, res: Response) => {
    const filter = req.query.filter || ""

    const instructors = await Instructor.find({
        username: {
            "$regex": filter , "$options" : 'i'
        }
    })

    res.status(200).json({
        instructors
    })
})

const upload = multer({ dest: 'uploads/' })

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
})

router.post('/image/upload', upload.single('image'), async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path);

    const { public_id, url } = result;

    res.status(200).json({ url, publicId: public_id });
})

router.delete('/image/delete/:publicId', async (req: Request, res: Response) => {
    const publicId = req.params.publicId;

    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({ message: 'Image deleted successfully' });
})

export { router as adminRouter }