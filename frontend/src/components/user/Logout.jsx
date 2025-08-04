import {useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {useNavigate} from "react-router";
import paths from "../../paths";

const Logout = () => {
    const logoutUser = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    useEffect(() => {
        logoutUser();
        navigate(paths.login)
    }, [logoutUser, navigate]);

    return null;
};

export default Logout;
