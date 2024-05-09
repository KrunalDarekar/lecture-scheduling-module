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
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const admin_1 = require("./admin");
const instructor_1 = require("./instructor");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const db_1 = require("../db");
const router = express_1.default.Router();
exports.router = router;
router.use("/admin", admin_1.adminRouter);
router.use("/instructor", instructor_1.instructorRouter);
router.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({});
    }
    const tokenArr = authHeader.split(" ");
    const decoded = jsonwebtoken_1.default.verify(tokenArr[1], config_1.jwt_secret);
    if (typeof decoded !== 'string') {
        if (decoded.type === 'admin') {
            return res.status(200).json({
                username: "admin@super",
                type: decoded.type
            });
        }
        else if (decoded.type === 'instructor') {
            const instructor = yield db_1.Instructor.findById(decoded.instructorId);
            if (instructor) {
                return res.status(200).json({
                    username: instructor === null || instructor === void 0 ? void 0 : instructor.username,
                    type: decoded.type
                });
            }
            return res.status(403).json({
                message: "the token has expired"
            });
        }
        return res.status(403).json({
            message: "the token has expired"
        });
    }
    else {
        return res.status(403).json({
            message: "the token has expired"
        });
    }
}));
router.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
