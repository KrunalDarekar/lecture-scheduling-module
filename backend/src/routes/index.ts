import express, { Request, Response, NextFunction } from "express"
import { adminRouter } from "./admin"
import { instructorRouter } from "./instructor"

const router = express.Router()

router.use("/admin", adminRouter)
router.use("/instructor", instructorRouter)

router.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    })
})

export { router }