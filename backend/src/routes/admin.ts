import express, { Request, Response } from "express"
import jwt from "jsonwebtoken"
import { Admin } from "../db"
import  dotenv from "dotenv"

dotenv.config()

const jwt_secret = process.env.JWT_SECRET || ""
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
        type: admin,
    }, jwt_secret)

    return res.status(201).json({
        message: "admin created",
        token: token
    })
})

export { router as adminRouter }