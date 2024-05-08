import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();

const app = express();

app.use(cors());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App is running on port ${port}`);
});

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "server healthy"
    });
});