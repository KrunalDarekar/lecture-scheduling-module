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
exports.instructorRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const config_1 = require("../config");
const middleware_1 = require("./middleware");
const router = express_1.default.Router();
exports.instructorRouter = router;
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const existing = yield db_1.Instructor.findOne({ username });
    if (existing) {
        return res.status(411).json({
            message: "username already taken"
        });
    }
    const instructor = new db_1.Instructor({
        username,
        password
    });
    yield instructor.save();
    const instructorId = instructor._id;
    const token = jsonwebtoken_1.default.sign({
        instructorId: instructorId,
        type: "instructor",
    }, config_1.jwt_secret);
    return res.status(201).json({
        message: "instructor created",
        token: token
    });
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const instructor = yield db_1.Instructor.findOne({
        username,
        password
    });
    if (instructor) {
        const instructorId = instructor._id;
        const token = jsonwebtoken_1.default.sign({
            instructorId: instructorId,
            type: "instructor",
        }, config_1.jwt_secret);
        return res.status(200).json({
            message: "signed in",
            token: token
        });
    }
    else {
        res.status(411).json({
            message: "Error while logging in"
        });
    }
}));
router.get("/lectures", middleware_1.instructorAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const instrucotrId = req.instructorId;
    const lectures = yield db_1.Lecture.find({
        instructor: instrucotrId
    });
    res.status(200).json({
        lectures
    });
}));
router.get("/courses", middleware_1.instructorAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const instrucotrId = req.instructorId;
    const courses = yield db_1.Course.find({});
    res.status(200).json({
        courses
    });
}));
