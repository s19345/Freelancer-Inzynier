import React, {useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import {USERS_BACKEND_URL} from '../../settings';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Stack,
} from '@mui/material';

const PasswordResetConfirm = () => {
    const {uid, token} = useParams();
    const navigate = useNavigate();

    const [newPassword1, setNewPassword1] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors(null);
        setLoading(true);

        try {
            const response = await fetch(`${USERS_BACKEND_URL}password/reset/confirm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    uid,
                    token,
                    new_password1: newPassword1,
                    new_password2: newPassword2,
                }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setErrors(data);
            }
        } catch (err) {
            setErrors('Wystąpił błąd sieci.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4}>
            <Typography variant="h5" gutterBottom>
                Resetowanie hasła
            </Typography>

            {success ? (
                <Alert severity="success">
                    Hasło zostało zmienione. Za chwilę nastąpi przekierowanie do logowania...
                </Alert>
            ) : (
                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Nowe hasło"
                            type="password"
                            value={newPassword1}
                            onChange={(e) => setNewPassword1(e.target.value)}
                            required
                            fullWidth
                            error={!!errors?.new_password1}
                            helperText={errors?.new_password1?.[0]}
                        />

                        <TextField
                            label="Powtórz nowe hasło"
                            type="password"
                            value={newPassword2}
                            onChange={(e) => setNewPassword2(e.target.value)}
                            required
                            fullWidth
                            error={!!errors?.new_password2}
                            helperText={errors?.new_password2?.[0]}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            fullWidth
                        >
                            {loading ? <CircularProgress size={24} color="inherit"/> : 'Zmień hasło'}
                        </Button>
                    </Stack>
                </Box>
            )}
        </Box>
    );
};

export default PasswordResetConfirm;
