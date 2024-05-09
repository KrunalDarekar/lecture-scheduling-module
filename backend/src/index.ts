import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
import { router } from "./routes";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
    return res.status(200).json({
        message: "server healthy"
    });
});

app.use("/api/v1", router)

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
})