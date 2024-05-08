"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jwt_secret = process.env.JWT_SECRET || "";
const router = express_1.default.Router();
exports.adminRouter = router;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.username);
    const username = req.body.username;
    const password = req.body.password;
    const existing = yield db_1.Admin.findOne({ username });
    if (existing) {
        return res.status(411).json({
            message: "username already taken"
        });
    }
    const admin = new db_1.Admin({
        username,
        password
    });
    yield admin.save();
    const adminId = admin._id;
    const token = jsonwebtoken_1.default.sign({
        adminId: adminId,
        type: admin,
    }, jwt_secret);
    return res.status(201).json({
        message: "admin created",
        token: token
    });
}));
