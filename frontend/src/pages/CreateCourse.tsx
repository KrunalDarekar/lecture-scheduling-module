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

export interface Image {
    url: string,
    publicId: string,
}

const CreateCourse = () => {
    const token = localStorage.getItem('token')
    const [name, setName] = useState<string>('');
    const [level, setLevel] = useState<string>('Beginner');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<Image>();
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
                    <ImageUploader uploadedImage={image} setUploadedImage={setImage} />
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

const ImageUploader = ({uploadedImage, setUploadedImage}: {uploadedImage:Image | undefined, setUploadedImage: Function}) => {
    const { toast } = useToast();

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await axios.post(`${base_url}/admin/image/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setUploadedImage({
                url: response.data.url,
                publicId: response.data.publicId,
            });

            toast({
                title: "Success!",
                description: "Image uploaded successfully",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Uh oh something went wrong!",
                description: error.response ? error.response.data.message : "Error uploading image",
            });
        }
    };

    const handleDeleteImage = async () => {
        if (!uploadedImage) return;

        try {
            await axios.delete(`${base_url}/admin/image/delete/${uploadedImage.publicId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            setUploadedImage(null);

            toast({
                title: "Success!",
                description: "Image deleted successfully",
            });
        } catch (error: any) {
            console.error('Error deleting image:', error);
            toast({
                variant: "destructive",
                title: "Uh oh something went wrong!",
                description: error.response ? error.response.data.message : "Error deleting image",
            });
        }
    }

    return (
        <div>
            {!uploadedImage && (
                <input type="file" accept="image/*" onChange={handleFileChange} />
            )}

            {uploadedImage && (
                <div>
                    <img src={uploadedImage.url} alt="Uploaded" width="200" />
                    <Button variant="destructive" onClick={handleDeleteImage}>
                        Delete Image
                    </Button>
                </div>
            )}
        </div>
    )
};

export default CreateCourse;
