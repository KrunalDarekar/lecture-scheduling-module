import { Button } from "@/components/ui/button";
import { isSignedInAtom, userAtom } from "@/state/atoms";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useEffect } from "react";

const Landing = () => {
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const user = useRecoilValue(userAtom);
    const isSignedIn = useRecoilValue(isSignedInAtom);

    useEffect(() => {
        if (user) {
            if (user.type === "admin") {
                navigate("/admin");
            } else if (user.type === "instructor") {
                navigate('/instructor');
            }
        }
    }, [user, navigate]);

    if (!token || !isSignedIn) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Button onClick={() => navigate('/signin/admin')} variant="outline"> Log in as an Admin</Button>
                <div>or</div>
                <Button onClick={() => navigate('/signin/instructor')} variant="outline"> Log in as an Instructor</Button>
            </div>
        );
    }

    return (
        <div>
            landing
        </div>
    );
};

export default Landing;
