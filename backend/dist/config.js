"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_SECRET = exports.API_KEY = exports.CLOUD_NAME = exports.jwt_secret = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.jwt_secret = process.env.JWT_SECRET || "";
exports.CLOUD_NAME = process.env.CLOUD_NAME || "";
exports.API_KEY = process.env.API_KEY || "";
exports.API_SECRET = process.env.API_SECRET || "";
