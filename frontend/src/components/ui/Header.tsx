import { isSignedInAtom, userAtom } from "@/state/atoms";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "./button";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Header = () => {
    const user = useRecoilValue(userAtom)
    const type = user.type.charAt(0).toUpperCase() + user.type.slice(1) || ""
    const toLink = type === "Admin" ? '/admin' : '/instructor'
    const navigate = useNavigate()
    const setIsSignedIn = useSetRecoilState(isSignedInAtom)

    const handleSignOut = () => {
        localStorage.clear()
        setIsSignedIn(false)
        navigate('/')
    }
    
    return (
        <header className="flex px-5 md:px-10 py-4 items-center justify-between shadow">
            <Link to={toLink} className="text-2xl font-bold">{`${type} Dash`}</Link>
            <Button onClick={handleSignOut}>Signout</Button>
        </header>
    )
};

export default Header;
