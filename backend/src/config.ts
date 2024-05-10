import  dotenv from "dotenv"
dotenv.config()

export const jwt_secret = process.env.JWT_SECRET || ""
export const CLOUD_NAME = process.env.CLOUD_NAME || ""
export const API_KEY = process.env.API_KEY || ""
export const API_SECRET = process.env.API_SECRET || ""