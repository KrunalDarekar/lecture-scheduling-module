import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Course, Instructor, Lecture } from "../db"
import { jwt_secret } from "../config"
import { InstructorAuthRequest, instructorAuthMiddleware } from "./middleware"

const router = express.Router()

router.post("/signup", async(req:Request, res: Response) => {
    const username = req.body.username
    const password = req.body.password

    const existing = await Instructor.findOne({username})
    if(existing) {
        return res.status(411).json({
            message: "username already taken"
        })
    }

    const instructor = new Instructor({
        username,
        password
    })

    await instructor.save()

    const instructorId = instructor._id

    const token = jwt.sign({
        instructorId: instructorId,
        type: "instructor",
    }, jwt_secret)

    return res.status(201).json({
        message: "instructor created",
        token: token
    })
})

router.post("/signin", async(req: Request, res: Response) => {
    const username = req.body.username
    const password = req.body.password

    const instructor = await Instructor.findOne({
        username,
        password
    })

    if(instructor) {
        const instructorId = instructor._id

        const token = jwt.sign({
            instructorId: instructorId,
            type: "instructor",
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

router.get("/lectures", instructorAuthMiddleware, async(req: InstructorAuthRequest, res: Response) => {
    const instrucotrId = req.instructorId

    const lectures = await Lecture.find({
        instructor: instrucotrId
    })

    res.status(200).json({
        lectures
    })
})

router.get("/courses", instructorAuthMiddleware, async(req: Request, res: Response) => {

    const courses = await Course.find({})

    res.status(200).json({
        courses
    })
})

export { router as instructorRouter }