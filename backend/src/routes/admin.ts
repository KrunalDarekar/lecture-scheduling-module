import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Admin, Course, Instructor, Lecture } from "../db"
import { jwt_secret } from "../config"
import { InstructorAuthRequest, adminAuthMiddleware } from "./middleware"

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
                return res.status(409).json({
                    message: `Instructor already has a lecture scheduled on ${date}`,
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

router.post("/lecture", adminAuthMiddleware, async(req: Request, res: Response) => {
    const {courseId, instructor, date} = req.body

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

router.get("/courses", adminAuthMiddleware , async(req: Request, res: Response) => {

    const courses = await Course.find({})

    res.status(200).json({
        courses
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

export { router as adminRouter }