import { base_url } from "@/config"
import axios from "axios"
import { useEffect, useState } from "react"

export interface Course  {
    _id: string,
    name: string,
    level: 'Beginner' | 'Intermediate' | 'Advance',
    description: string,
    image: string,
    lectures: string[]
}

export const useCourses = () => {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${base_url}/admin/courses`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            setCourses(res.data.courses)
            setLoading(false)
        })
    },[])

    return {
        courses,
        loading
    }
}

export const useCourse = (id:string) => {
    const [course, setCourses] = useState<Course>()
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${base_url}/admin/course/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            setCourses(res.data.course)
            setLoading(false)
        })
    },[])

    return {
        course,
        loading
    }
}

interface Instructor {
    _id: string,
    username: string,
}

export const useInstructors = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${base_url}/admin/instructors`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            setInstructors(res.data.instructors)
            setLoading(false)
        })
    },[])

    return {
        instructors,
        loading
    }
}

interface Lecture {
    _id: string,
    instructor: string,
    date: string,
}

export const useLectures = () => {
    const [lectures, setLectures] = useState<Lecture[]>([])
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        axios.get(`${base_url}/admin/lectures`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
        .then((res) => {
            setLectures(res.data.lectures)
            setLoading(false)
        })
    },[])

    return {
        lectures,
        loading
    }
}

