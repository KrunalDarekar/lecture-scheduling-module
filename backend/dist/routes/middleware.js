"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.instructorAuthMiddleware = exports.adminAuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config");
const adminAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({});
    }
    const tokenArr = authHeader.split(" ");
    const decoded = jsonwebtoken_1.default.verify(tokenArr[1], config_1.jwt_secret);
    console.log(decoded);
    if (typeof decoded !== 'string' && decoded.type === "admin") {
        next();
    }
    else {
        return res.status(403).json({
            message: "access denied"
        });
    }
};
exports.adminAuthMiddleware = adminAuthMiddleware;
const instructorAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({});
    }
    const tokenArr = authHeader.split(" ");
    const decoded = jsonwebtoken_1.default.verify(tokenArr[1], config_1.jwt_secret);
    if (typeof decoded !== 'string' && decoded.type === "instructor") {
        req.instructorId = decoded.instrucotrId;
        next();
    }
    else {
        return res.status(403).json({
            message: "access denied"
        });
    }
};
exports.instructorAuthMiddleware = instructorAuthMiddleware;
