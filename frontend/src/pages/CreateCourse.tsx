import Header from "@/components/ui/Header";
import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { base_url } from "@/config";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useInstructors } from "@/hooks";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Lecture {
    instructor: string;
    date: string;
}

const CreateCourse = () => {
    const token = localStorage.getItem('token')
    const [name, setName] = useState<string>('');
    const [level, setLevel] = useState<string>('Beginner');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [lectures, setLectures] = useState<Lecture[]>([{ instructor: '', date: '' }]);
    const {instructors, loading} = useInstructors()
    const {toast} = useToast()
    const navigate = useNavigate()

    if(loading) {
        return (
            <div className="flex justify-center items-center h-screen">loading...</div>
        )
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 

        try {
            const requestBody = {
                name,
                level,
                description,
                image,
                lectures,
            }
            const response = await axios.post(`${base_url}/admin/course`, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            })
            console.log(response)

            toast({
                title: "Success!",
                description: "course created successfully"
            })

            navigate('/admin')

        } catch (error:any) {
            toast({
                variant: "destructive",
                title: "Uh oh something went wrong!",
                description: error.response.data.message
            })
        }
    };

    const addLecture = () => {
        setLectures([...lectures, { instructor: '', date: '' }]);
    };

    const updateLecture = (index: number, field: keyof Lecture, value: string) => {
        const updatedLectures = [...lectures];
        updatedLectures[index][field] = value;
        setLectures(updatedLectures);
    };

    const removeLecture = (index: number) => {
        const updatedLectures = [...lectures];
        updatedLectures.splice(index, 1);
        setLectures(updatedLectures);
    };

    return (
        <div>
            <Header/>
            <div className="flex justify-center my-5 mx-5 md:mx-10 lg:mx-auto lg:max-w-3xl">
            <div className="w-full">
            <form onSubmit={handleSubmit}>
                <div className="mb-2">
                    <Label className="text-base" htmlFor="name">Name:</Label>
                    <Input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="flex flex-col mb-2">
                    <Label className="text-base" htmlFor="level">Level:</Label>
                    <select className="border rounded mt-1"
                        id="level"
                        value={level}
                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setLevel(e.target.value)}
                        required
                    >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                    </select>
                </div>

                <div className="mb-2">
                    <Label className="text-base" htmlFor="description">Description:</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-2">
                    <Label className="text-base" htmlFor="image">Image:</Label>
                    <Input
                        type="text"
                        id="image"
                        value={image}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setImage(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1">
                        <div className="text-base font-semibold">Lectures</div>
                        <Button className="bg-green-600 text-white hover:bg-green-500" variant={"secondary"} onClick={addLecture}>Add Lecture</Button>
                    </div>
                    {lectures.map((lecture, index) => (
                        <div key={index} className="mb-2">
                            <select className="border rounded mb-1 w-full"
                                value={lecture.instructor}
                                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                                    updateLecture(index, 'instructor', e.target.value)
                                }}
                                required
                            > <option value={""}>select an instructor</option>
                                {
                                    instructors.map((instructor) => {
                                        return <option key={instructor._id} value={instructor._id}>{instructor.username}</option>
                                    })
                                }
                            </select>
                            <Input
                                type="date"
                                placeholder="Date"
                                value={lecture.date}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => updateLecture(index, 'date', e.target.value)}
                                required
                            />
                            <div className="flex justify-center items-center mt-1">
                            <Button variant={"destructive"} onClick={() => removeLecture(index)}>Remove Lecture</Button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button className="w-full" type="submit">Create Course</Button>
            </form>
            </div>
            </div>
        </div>
    );
};

export default CreateCourse;
