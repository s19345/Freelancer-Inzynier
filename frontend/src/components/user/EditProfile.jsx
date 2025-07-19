import React, {useEffect, useState} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Box, Typography, TextField, Button, Alert} from '@mui/material';

const EditProfile = () => {
    const user = useAuthStore((state) => state.user);
    const updateUserData = useAuthStore((state) => state.updateUserData);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [form, setForm] = useState({
        username: '',
        email: '',
        bio: ''
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
        setMessage(null);
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateUserData(form);

        if (success) {
            setMessage('Dane u¿ytkownika zosta³y zaktualizowane');
            setError(null);
        } else {
            setError('Wyst±pi³ b³±d podczas aktualizacji');
            setMessage(null);
        }
    };

    if (!isLoggedIn) {
        return (
            <Typography variant="body1" sx={{mt: 2, textAlign: 'center'}}>
                Musisz byæ zalogowany, aby edytowaæ profil.
            </Typography>
        );
    }

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h2" gutterBottom>
                Edytuj profil
            </Typography>

            <TextField
                label="Nick"
                name="username"
                value={form.username}
                onChange={handleChange}
                required
                fullWidth
            />

            <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                fullWidth
            />

            <TextField
                label="Bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />

            <Button variant="contained" type="submit" sx={{mt: 2}}>
                Zapisz zmiany
            </Button>

            {message && <Alert severity="success">{message}</Alert>}
            {error && <Alert severity="error">{error}</Alert>}
        </Box>
    );
};

export default EditProfile;
