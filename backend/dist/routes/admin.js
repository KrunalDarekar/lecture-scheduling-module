"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const config_1 = require("../config");
const middleware_1 = require("./middleware");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const router = express_1.default.Router();
exports.adminRouter = router;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existing = yield db_1.Admin.findOne({ username });
    if (existing) {
        return res.status(411).json({
            message: "username already taken"
        });
    }
    const admin = new db_1.Admin({
        username,
        password
    });
    yield admin.save();
    const adminId = admin._id;
    const token = jsonwebtoken_1.default.sign({
        adminId: adminId,
        type: "admin",
    }, config_1.jwt_secret);
    return res.status(201).json({
        message: "admin created",
        token: token
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const admin = yield db_1.Admin.findOne({
        username,
        password
    });
    if (admin) {
        const adminId = admin._id;
        const token = jsonwebtoken_1.default.sign({
            adminId: adminId,
            type: "admin",
        }, config_1.jwt_secret);
        return res.status(200).json({
            message: "signed in",
            token: token
        });
    }
    else {
        res.status(411).json({
            message: "Error while logging in"
        });
    }
}));
router.post("/course", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, level, description, image, lectures } = req.body;
    if (!name || !level || !description || !image) {
        return res.status(400).json({
            message: 'All fields are required: name, level, description, and image',
        });
    }
    const newCourse = new db_1.Course({
        name,
        level,
        description,
        image,
    });
    if (lectures && lectures.length > 0) {
        for (const lecture of lectures) {
            const { instructor, date } = lecture;
            if (!instructor || !date) {
                return res.status(400).json({
                    message: 'Each lecture must have an instructor and date',
                });
            }
            const existingLecture = yield db_1.Lecture.findOne({
                instructor,
                date,
            });
            if (existingLecture) {
                for (const lecture of newCourse.lectures) {
                    yield db_1.Lecture.deleteOne({
                        _id: lecture
                    });
                }
                const name = yield db_1.Instructor.findById(instructor);
                return res.status(409).json({
                    message: `${(name === null || name === void 0 ? void 0 : name.username) || "user"} already has a lecture scheduled on ${date}`,
                });
            }
            const newLecture = new db_1.Lecture({
                course: newCourse._id,
                instructor,
                date,
            });
            yield newLecture.save();
            newCourse.lectures.push(newLecture._id);
        }
    }
    const savedCourse = yield newCourse.save();
    res.status(201).json({
        message: 'Course created successfully',
        course: savedCourse,
    });
}));
router.delete("/course/:id", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.id;
    const course = yield db_1.Course.findById(courseId);
    if (!course) {
        return res.status(404).json({ message: "Course not found" });
    }
    if (course.lectures && course.lectures.length > 0) {
        yield db_1.Lecture.deleteMany({ _id: { $in: course.lectures } });
    }
    yield db_1.Course.deleteOne({ _id: courseId });
    res.status(200).json({ message: "Course deleted successfully" });
}));
router.post("/lecture", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, instructor, date } = req.body;
    if (!instructor.length || !date.length) {
        return res.status(409).json({
            message: `select date and instructor`,
        });
    }
    const existingLecture = yield db_1.Lecture.findOne({
        instructor,
        date,
    });
    if (existingLecture) {
        return res.status(409).json({
            message: `Instructor already has a lecture scheduled on ${date}`,
        });
    }
    const course = yield db_1.Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            message: "course not found"
        });
    }
    const newLecture = new db_1.Lecture({
        course: courseId,
        instructor,
        date,
    });
    course.lectures.push(newLecture._id);
    yield course.save();
    const savedLecture = yield newLecture.save();
    res.status(201).json({
        message: "lecture added",
        lecture: savedLecture
    });
}));
router.get("/course/:id", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = req.params.id;
    const course = yield db_1.Course.findById(courseId);
    if (!course) {
        return res.status(404).json({
            message: "Course not found",
        });
    }
    res.status(200).json({
        course,
    });
}));
router.get("/courses", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield db_1.Course.find({});
    res.status(200).json({
        courses
    });
}));
router.get("/lectures", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lectures = yield db_1.Lecture.find({});
    res.status(200).json({
        lectures
    });
}));
router.get("/instructors", middleware_1.adminAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = req.query.filter || "";
    const instructors = yield db_1.Instructor.find({
        username: {
            "$regex": filter, "$options": 'i'
        }
    });
    res.status(200).json({
        instructors
    });
}));
const upload = (0, multer_1.default)({ dest: 'uploads/' });
cloudinary_1.v2.config({
    cloud_name: config_1.CLOUD_NAME,
    api_key: config_1.API_KEY,
    api_secret: config_1.API_SECRET,
});
// Route to upload an image
router.post('/image/upload', upload.single('image'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const result = yield cloudinary_1.v2.uploader.upload(file.path);
    const { public_id, url } = result;
    res.status(200).json({ url, publicId: public_id });
}));
router.delete('/image/delete/:publicId', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const publicId = req.params.publicId;
    yield cloudinary_1.v2.uploader.destroy(publicId);
    res.status(200).json({ message: 'Image deleted successfully' });
}));
