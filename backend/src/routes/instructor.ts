import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Instructor } from "../db"
import  dotenv from "dotenv"
dotenv.config()

const jwt_secret = process.env.JWT_SECRET || ""

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
        type: instructor,
    }, jwt_secret)

    return res.status(201).json({
        message: "instructor created",
        token: token
    })
})

export { router as instructorRouter }