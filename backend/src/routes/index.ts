import express, { Request, Response, NextFunction } from "express"
import { adminRouter } from "./admin"
import { instructorRouter } from "./instructor"
import jwt from "jsonwebtoken"
import { jwt_secret } from "../config"
import { Instructor } from "../db"
import { decode } from "punycode"

const router = express.Router()

router.use("/admin", adminRouter)
router.use("/instructor", instructorRouter)

router.get('/me', async(req: Request, res: Response) => {
    const authHeader = req.headers.authorization 
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({})
    }

    const tokenArr = authHeader.split(" ")
    const decoded= jwt.verify(tokenArr[1], jwt_secret)

    if(typeof decoded !== 'string') {
        if(decoded.type === 'admin') {
            return res.status(200).json({
                username: "admin@super",
                type: decoded.type
            })
        } else if (decoded.type === 'instructor') {
            const instructor = await Instructor.findById(decoded.instructorId)
            if(instructor) {
                return res.status(200).json({
                    username: instructor?.username,
                    type: decoded.type
                })
            }
            return res.status(403).json({
                message: "the token has expired"
            })
        }
        return res.status(403).json({
            message: "the token has expired"
        })
    } else {
        return res.status(403).json({
            message: "the token has expired"
        })
    }
})

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    })
})

export { router }