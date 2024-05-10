import Header from "@/components/ui/Header";
import LevelBadge from "@/components/ui/LevelBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCourse, useInstructors, useLectures } from "@/hooks";
import {  useNavigate, useParams } from "react-router-dom";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useState } from "react";
import axios from "axios";
import { base_url } from "@/config";
import { useToast } from "@/components/ui/use-toast";

const Course = () => {

    const {id} = useParams() 

    const {course, loading} = useCourse(id || "")
    const {lectures} = useLectures()
    const {instructors} = useInstructors()
    const [addInstructor, setAddInstructor] = useState("")
    const [addDate, setAddDate] = useState("")
    const token = localStorage.getItem('token')
    const {toast} = useToast()
    const navigate = useNavigate()

    const handleAddLecture = async() => {
        try {
            const requestBody = {
                courseId: course?._id,
                instructor: addInstructor,
                date: addDate
            }
            const response = await axios.post(`${base_url}/admin/lecture`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })

            console.log(response)

            toast({
                title: "Success!",
                description: "lecture added successfully"
            })
            
            window.location.reload()
        }
        catch(e: any) {
            toast({
                variant: "destructive",
                title: "Uh oh something went wrong!",
                description: e.response ? e.response.data.message : "error while adding lecture"
            })
        }
    }

    const handleDeleteCourse = async() => {
        try {
            const response = await axios.delete(`${base_url}/admin/course/${id}`,  {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })

            console.log(response)

            toast({
                title: "Success!",
                description: "course deleted successfully"
            })

            navigate('/admin')

        } catch(e: any) {
            toast({
                variant: "destructive",
                title: "Uh oh something went wrong!",
                description: e.response ? e.response.data.message : "error while deleting course"
            })
        }
    }

    if(loading || !course || lectures.length < 1 || instructors.length < 1) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div>loading...</div>
            </div>
        )
    }

    return (
    
        <div>
            <Header/>
            <div className="mx-5 md:mx-10 lg:mx-auto lg:max-w-3xl my-5">
            <Card className="">
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
                    <div className="mb-2">
                        {course.image}
                    </div>
                    <Separator className="mb-2"/>
                    <div>
                        <div className="text-lg font-bold:">Lectures</div>
                        {
                            course.lectures.map((lectureId) => {
                                const lecture = lectures.filter((lecture) => lecture._id === lectureId)[0]
                                const Instructor = instructors.filter((instructor) => instructor._id === lecture.instructor)[0]
                                const date = new Date(lecture.date.slice(0,10))

                                return <div key={lectureId} className="mt-1 border rounded px-2">
                                    <div>date: {date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}</div>
                                    <div>instructor: {Instructor.username}</div>
                                </div>
                            })
                        }
                    </div>
                </CardContent>
            </Card>
            <div className="mt-4 flex justify-center gap-4 md:gap-8">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant={"secondary"}>+ Add Lecture</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Add Lecture</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                        <div className="items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Instructor
                            </Label>
                            <select className="border rounded mt-1 w-full"
                                value={addInstructor}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    setAddInstructor(e.target.value)
                                }}
                                required
                            > <option value={""}>select an instructor</option>
                                {
                                    instructors.map((instructor) => {
                                        return <option key={instructor._id} value={instructor._id}>{instructor.username}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="username" className="text-right">
                            Date
                            </Label>
                            <Input className="mt-1"
                                type="date"
                                placeholder="Date"
                                value={addDate}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                    setAddDate(e.target.value)
                                }}
                                required
                            />
                        </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild><Button onClick={handleAddLecture} type="submit">+ Add</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                    <Button variant={"destructive"}>Delete Course</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove your data from our servers.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteCourse}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
        </div>

    )
}

export default Course;
