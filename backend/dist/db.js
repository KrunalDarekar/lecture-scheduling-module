"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.Lecture = exports.Instructor = exports.Admin = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
const { Schema } = mongoose_1.default;
const connectionString = process.env.MONGO_CONNECTION_URL || "";
mongoose_1.default.connect(connectionString);
const AdminSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, { timestamps: true });
const InstructorSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const LectureSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'Instructor',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
}, { timestamps: true });
const CourseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: {
            url: {
                type: String,
                required: true,
            },
            publicId: {
                type: String,
                required: true,
            },
        },
        required: true,
    },
    lectures: [{
            type: Schema.Types.ObjectId,
            ref: 'Lecture',
            required: true,
        }]
}, { timestamps: true });
const Admin = mongoose_1.default.model('Admin', AdminSchema);
exports.Admin = Admin;
const Instructor = mongoose_1.default.model('Instructor', InstructorSchema);
exports.Instructor = Instructor;
const Lecture = mongoose_1.default.model('Lecture', LectureSchema);
exports.Lecture = Lecture;
const Course = mongoose_1.default.model('Course', CourseSchema);
exports.Course = Course;
