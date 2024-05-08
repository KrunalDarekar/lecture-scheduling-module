import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
const { Schema } = mongoose;

const connectionString = process.env.MONGO_CONNECTION_URL || ""

mongoose.connect(connectionString)

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
}, {timestamps: true})

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
}, { timestamps: true })

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
}, { timestamps: true })

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
        type: String,
        required: true
    },
    lectures: [LectureSchema]
}, { timestamps: true })

const Admin = mongoose.model('Admin', AdminSchema)
const Instructor = mongoose.model('Instructor', InstructorSchema)
const Lecture = mongoose.model('Lecture', LectureSchema)
const Course = mongoose.model('Course', CourseSchema)

export { Admin, Instructor, Lecture, Course }