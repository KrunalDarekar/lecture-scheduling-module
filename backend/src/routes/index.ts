import express from "express"
import { adminRouter } from "./admin"
import { instructorRouter } from "./instructor"

const router = express.Router()

router.use("/admin", adminRouter)
router.use("/instructor", instructorRouter)

export { router }