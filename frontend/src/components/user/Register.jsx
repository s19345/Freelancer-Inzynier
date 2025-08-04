import React, {useState} from 'react';
import useAuthStore from "../../zustand_store/authStore";

import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Alert,
} from '@mui/material';
import useGlobalStore from "../../zustand_store/globalInfoStore";
import {useNavigate} from "react-router";
import paths from "../../paths";

export default function Register() {
    const {error, loading, registerUser} = useAuthStore();
    const setMessage = useGlobalStore.getState().setMessage;
    const setType = useGlobalStore.getState().setType;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });


    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const success = await registerUser(formData);

        if (success) {
            setMessage('Rejestracja zakończona sukcesem');
            setType('success');
            navigate(paths.login)
        }
    };

    const handleLoginClick = () => {
        navigate(paths.login);
    }

    return (
        <Box
            sx={{
                maxWidth: 400,
                mx: 'auto',
                mt: 5,
                p: 4,
            }}
            elevation={3}
        >
            <Typography variant="h5" gutterBottom>
                Rejestracja
            </Typography>
            <Box component="form" onSubmit={handleSubmit}
                 sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                <TextField
                    label="Nazwa użytkownika"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Hasło"
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Powtórz hasło"
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24}/> : "Zarejestruj"}
                </Button>

                <Button
                    onClick={() => handleLoginClick()}
                >
                    Masz już konto? zaloguj się
                </Button>
            </Box>
            {error && (
                <Alert severity="error" sx={{mt: 2}}>
                    {error}
                </Alert>
            )}
        </Box>
    );
}
