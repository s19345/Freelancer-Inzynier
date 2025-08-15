import React, {useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Box, Typography, Stack} from '@mui/material';
import UserProfileCard from "./UserProfileCard";
import ProjectsCard from "./ProjectsCard";
import StaticsBox from "./UserStatics";
import {fetchLastActiveProjects} from "../fetchers";

const UserProfile = () => {
    const {user, isLoggedIn, fetchUser, setUser, token} = useAuthStore();
    const [workTimeSeconds, setWorkTimeSeconds] = React.useState(null);

    useEffect(() => {
        const loadWorkTime = async () => {
            try {
                const data = await fetchLastActiveProjects(token);

                let totalSeconds = 0;

                for (let i = 0; i < 7; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

                    const entry = data.total_daily_times
                        .find(item => item.date === dateStr);
                    if (entry) {
                        totalSeconds += entry.total_time;
                    }
                }

                setWorkTimeSeconds((totalSeconds));
            } catch (err) {
                console.error("Błąd przy pobieraniu czasu pracy:", err);
            }
        };

        loadWorkTime();
    }, [token]);


    useEffect(() => {
        const fetchData = async () => {
            try {
                await fetchUser();
            } catch (error) {
                console.error("Błąd przy pobieraniu danych użytkownika lub umiejętności:", error);
            }
        };

        fetchData();
    }, [isLoggedIn, fetchUser, setUser]);

    if (!isLoggedIn) {
        return <Typography variant="body1">Musisz być zalogowany, aby zobaczyć profil użytkownika.</Typography>;
    }

    if (!user) {
        return <Typography variant="body1">Ładowanie danych użytkownika...</Typography>;
    }

    return (
        <Box sx={{display: "flex", flexDirection: "row", gap: 2}}>
            <UserProfileCard user={user}/>
            <Stack spacing={2}>
                <ProjectsCard/>
                <StaticsBox workTime={workTimeSeconds}/>
            </Stack>
        </Box>
    );
};

export default UserProfile;
