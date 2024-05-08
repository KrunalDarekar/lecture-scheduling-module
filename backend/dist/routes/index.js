"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const admin_1 = require("./admin");
const instructor_1 = require("./instructor");
const router = express_1.default.Router();
exports.router = router;
router.use("/admin", admin_1.adminRouter);
router.use("/instructor", instructor_1.instructorRouter);
