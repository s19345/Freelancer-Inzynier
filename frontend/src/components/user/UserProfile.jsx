import React, {useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Link as RouterLink} from 'react-router';
import {Box, Typography, Button, Stack} from '@mui/material';

const UserProfile = () => {
    const {user, isLoggedIn, fetchUser} = useAuthStore();

    useEffect(() => {
        if (isLoggedIn && !user) {
            const fetchData = async () => {
                try {
                    await fetchUser();
                } catch (error) {
                    console.error("Błąd przy pobieraniu danych użytkownika:", error);
                }
            };
            fetchData();
        }
    }, [isLoggedIn, user, fetchUser]);

    if (!isLoggedIn) {
        return <Typography variant="body1">Musisz być zalogowany, aby zobaczyć profil użytkownika.</Typography>;
    }

    if (!user) {
        return <Typography variant="body1">Ładowanie danych użytkownika...</Typography>;
    }

    return (
        <Box
            sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                maxWidth: 400,
                mx: 'auto',
            }}
        >
            <Typography variant="h5" gutterBottom>
                Profil użytkownika
            </Typography>

            <Typography variant="body1" gutterBottom><strong>Nick:</strong> {user.username}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Bio:</strong> {user.bio || 'Brak informacji'}</Typography>

            <Stack direction="row" spacing={2} mt={2}>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to="/edit-profile"
                >
                    Edytuj profil
                </Button>

                <Button
                    variant="outlined"
                    component={RouterLink}
                    to="/change-password"
                >
                    Zmień hasło
                </Button>
            </Stack>
        </Box>
    );
};

export default UserProfile;
