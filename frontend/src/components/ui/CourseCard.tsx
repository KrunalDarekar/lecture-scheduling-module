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
            <Card className="h-80">
                <CardHeader className="h-1/3">
                    <div className="flex items-center justify-between">
                        <CardTitle>{course.name}</CardTitle>
                        <LevelBadge level={course.level} />
                    </div>
                    <CardDescription>{
                        course.description.length > 100 ? `${course.description.slice(0, 100)}...` : course.description}
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-2/3">
                    <div className="h-full w-full">
                        <img className="w-full h-full object-fit" src={course.image.url} alt="" />
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
};

export default CourseCard
