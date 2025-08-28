import React, {useState} from 'react';
import {USERS_BACKEND_URL} from '../../settings';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
} from '@mui/material';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await fetch(`${USERS_BACKEND_URL}password/reset/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email}),
            });

            const data = await response.json();

            if (!response.ok) {
                throw data;
            }

            setSuccessMessage('Link do resetu hasła został wysłany na podany adres e-mail.');
        } catch (error) {
            if (error?.email) {
                setErrorMessage(error.email.join(' '));
            } else {
                setErrorMessage('Wystąpił błąd podczas resetowania hasła.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box maxWidth={400} mx="auto" mt={2}>
            <Typography variant="h6" gutterBottom>
                Resetowanie hasła
            </Typography>

            <TextField
                label="Adres e-mail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errorMessage}
                helperText={errorMessage}
                required
                fullWidth
                margin="normal"
            />

            <Button
                variant="contained"
                disabled={loading}
                fullWidth
                sx={{mt: 2, mb: 2}}
                onClick={handleSubmit}
            >
                {loading ? <CircularProgress size={24} color="inherit"/> : 'Wyślij link resetujący'}
            </Button>

            {successMessage && (
                <Alert severity="success" sx={{mt: 1}}>
                    {successMessage}
                </Alert>
            )}
        </Box>
    );
};

export default PasswordReset;
