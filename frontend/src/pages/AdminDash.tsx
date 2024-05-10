import CourseCard from "@/components/ui/CourseCard";
import Header from "@/components/ui/Header";
import Loader from "@/components/ui/Loader";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks";
import { useNavigate } from "react-router-dom";

const AdminDash = () => {
    const {courses, loading} = useCourses()
    const navigate = useNavigate()

    if(loading) {
        return (
            <Loader/>
        )
    }

    return (
        <div>
            <Header/>
            <div className="my-4 flex justify-center items-center">
                <Button onClick={() => { navigate('/create')}}>+ Add Course</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-5 md:mx-10">
                {
                    courses.map( (course) => {
                        return <CourseCard key={course._id} course={course}/>
                    })
                }
            </div>
        </div>
    )
};

export default AdminDash;
