import Header from "@/components/ui/Header";
import LevelBadge from "@/components/ui/LevelBadge";
import Loader from "@/components/ui/Loader";
import { Separator } from "@/components/ui/separator";
import { base_url } from "@/config";
import { Course, Lecture } from "@/hooks";
import axios from "axios";
import { useEffect, useState } from "react";

const InstructorDash = () => {
    const [lectures, setLectures] = useState<Lecture[]>()
    const [courses, setCourses] = useState<Course[]>()
    const [error, setError] = useState(false)

    useEffect ( () => {
        const fetchData = async () => {
            try {
                // Fetch lectures
                const lecturesResponse = await axios.get(`${base_url}/instructor/lectures`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setLectures(lecturesResponse.data.lectures);

                // Fetch courses
                const coursesResponse = await axios.get(`${base_url}/instructor/courses`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setCourses(coursesResponse.data.courses);

            } catch (error) {
                setError(true)
            }
        }

        fetchData()
    },[])

    if(!lectures || !courses) {
        return (
            <Loader/>
        )
    }

    if(error) {
        return (
            <div className="flex justify-center items-center h-screen">Error while fetching data reload</div>
        )
    }

    return (
        <div >
            <Header/>
            <div className="mx-5 md:mx-10 lg:mx-auto my-5 lg:max-w-2xl">
                {
                    lectures.map((lecture) => {
                        const course = courses.filter((c) => c._id === lecture.course)[0]
                        const date = new Date(lecture.date.slice(0,10))
                        return <div key={lecture._id} className="border-2 rounded px-2 md:px-4 lg:px-8 py-2 mb-2">
                            <div className="font-semibold">Date</div>
                            <div className="">{<div>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</div>}</div>
                            <Separator/>
                            <div className="font-semibold">Course</div>
                            <div className="flex items-center gap-4">
                                <div>{course.name}</div>
                                <LevelBadge level={course.level}/>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    )
};

export default InstructorDash;
