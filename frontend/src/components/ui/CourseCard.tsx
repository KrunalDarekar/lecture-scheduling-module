import { Course } from "@/hooks";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import LevelBadge from "./LevelBadge";

const CourseCard = ({course}:{course:Course}) => {
    return (
        <Link to={`/course/${course._id}`}>
            <Card className="h-72">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{course.name}</CardTitle>
                        <LevelBadge level={course.level} />
                    </div>
                    <CardDescription>{
                        course.description.length > 100 ? `${course.description.slice(0, 100)}...` : course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="">
                        {course.image}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
};

export default CourseCard
