import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { base_url } from "@/config";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { useSetRecoilState } from "recoil";
import { isSignedInAtom, userAtom } from "@/state/atoms";

const InstructorSignIn = () => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const setUser = useSetRecoilState(userAtom)
    const setIsSignedIn = useSetRecoilState(isSignedInAtom)

    const navigate = useNavigate()
    const {toast} = useToast()

    const handleLogIn = async() => {
        const requestBody = {
            username,
            password,
        }

        try {
            const response = await axios.post(`${base_url}/instructor/signin`, requestBody);

            localStorage.setItem('token', response.data.token)

            toast({
                title: "Logged in!",
                description: "logged in successfully"
            })

            setUser({
                username,
                type: "instructor"
            })

            setIsSignedIn(true)

            navigate('/')

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Uh oh! something went wrong",
                description: "error while logging in"
            })
        }
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-[350px]">
                <div className="flex justify-center items-center">
                    <CardHeader>
                        <CardTitle>Instructor Log in</CardTitle>
                        <CardDescription>Log in as an admin <Link className="underline font-bold" to={'/signin/instructor'}>here</Link></CardDescription>
                    </CardHeader>
                </div>
                <CardContent>
                    <form>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="username">Username</Label>
                            <Input onChange={(e) => {
                                setUsername(e.target.value)
                            }} value={username} id="username" placeholder="Enter username" />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input onChange={(e) => {
                                setPassword(e.target.value)
                            }} value={password} id="password" placeholder="Enter password" type="password"/>
                        </div>
                    </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center items-cetner">
                    <Button onClick={handleLogIn}>Log in</Button>
                </CardFooter>
            </Card>
        </div>
    )
};

export default InstructorSignIn;
