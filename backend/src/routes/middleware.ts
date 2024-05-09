import jwt from "jsonwebtoken"
import { jwt_secret } from "../config"
import { Request, Response, NextFunction } from "express"

const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization 
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({})
    }

    const tokenArr = authHeader.split(" ")
    const decoded= jwt.verify(tokenArr[1], jwt_secret)

    if (typeof decoded !== 'string' && decoded.type === "admin") {
        next()
    } else {
        return res.status(403).json({
            message: "access denied"
        })
    }
}

export interface InstructorAuthRequest extends Request {
    instructorId?: string;
}

const instructorAuthMiddleware = (req: InstructorAuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization 
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({})
    }

    const tokenArr = authHeader.split(" ")
    const decoded= jwt.verify(tokenArr[1], jwt_secret)

    if (typeof decoded !== 'string' && decoded.type === "instructor") {
        req.instructorId = decoded.instructorId
        next()
    } else {
        return res.status(403).json({
            message: "access denied"
        })
    }
}

export {
    adminAuthMiddleware,
    instructorAuthMiddleware
}