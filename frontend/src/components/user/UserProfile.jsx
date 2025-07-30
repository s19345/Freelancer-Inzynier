import React, {useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Box, Typography, Stack} from '@mui/material';
import UserProfileCard from "./UserProfileCard";
import ProjectsCard from "./ProjectsCard";
import StaticsBox from "./UserStatics";

const UserProfile = () => {
    const {user, isLoggedIn, fetchUser, setUser} = useAuthStore();


    useEffect(() => {
            const fetchData = async () => {
                try {
                    await fetchUser();
                } catch (error) {
                    console.error("Błąd przy pobieraniu danych użytkownika lub umiejętności:", error);
                }
            };

            fetchData();
        }, [isLoggedIn, fetchUser, setUser]
    )
    ;

    if (!isLoggedIn) {
        return <Typography variant="body1">Musisz być zalogowany, aby zobaczyć profil użytkownika.</Typography>;
    }

    if (!user) {
        return <Typography variant="body1">Ładowanie danych użytkownika...</Typography>;
    }

    return (

        <Box sx={{display: "flex", flexDirection: "row"}}>
            <UserProfileCard user={user}/>
            <Stack spacing={2}>
                <ProjectsCard/>
                <StaticsBox/>
            </Stack>
        </Box>
    );
};

export default UserProfile;