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
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password1: '',
        password2: '',
    });

    const validate = () => {
        const newErrors = {};
        if (formData.password1.length < 8) newErrors.password1 = 'Hasło musi mieć co najmniej 8 znaków';
        return newErrors;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        const response = await registerUser(formData);

        if (response.success) {
            setMessage('Rejestracja zakończona sukcesem');
            setType('success');
            navigate(paths.login)
        } else if (response.errors) {
            setErrors(response.errors);
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
            <Box component="form" onSubmit={handleSubmit} noValidate
                 sx={{display: 'flex', flexDirection: 'column', gap: 2}}
            >
                <TextField
                    label="Nazwa użytkownika"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    required
                    fullWidth
                />
                <TextField
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                    fullWidth
                />
                <TextField
                    label="Hasło"
                    type="password"
                    name="password1"
                    value={formData.password1}
                    onChange={handleChange}
                    error={!!errors.password1}
                    helperText={errors.password1}
                    required
                    fullWidth
                />
                <TextField
                    label="Powtórz hasło"
                    type="password"
                    name="password2"
                    value={formData.password2}
                    onChange={handleChange}
                    error={!!errors.password2 || errors.non_field_errors}
                    helperText={errors.password2 || errors.non_field_errors}
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
