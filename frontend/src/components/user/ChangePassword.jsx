import React, {useState, useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Box, Typography, TextField, Button, Alert, Stack} from '@mui/material';


const ChangePassword = ({setIsEdited}) => {
    const {loading, error, successMessage, resetError, changePassword} = useAuthStore();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [errors, setErrors] = useState({});


    useEffect(() => {
        return () => {
            resetError();
        };
    }, [resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await changePassword({oldPassword, newPassword1, newPassword2});
        if (response?.errors) {
            setErrors(response.errors);
        } else {
            setErrors({});
        }

    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="10vh"
        >
            <Box
                sx={{
                    p: 3,
                    mx: 'auto',
                    mt: 4,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
                component="form"
                onSubmit={handleSubmit}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Zmień hasło
                </Typography>

                <TextField
                    label="Aktualne hasło"
                    type="password"
                    name="old_password"
                    error={!!errors.old_password}
                    helperText={errors.old_password}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}

                    fullWidth
                />

                <TextField
                    label="Nowe hasło"
                    type="password"
                    name="new_password1"
                    error={!!errors.new_password1}
                    helperText={errors.new_password1}
                    value={newPassword1}
                    onChange={(e) => setNewPassword1(e.target.value)}
                    fullWidth
                />

                <TextField
                    label="Powtórz nowe hasło"
                    type="password"
                    name="new_password2"
                    error={!!errors.new_password2}
                    helperText={errors.new_password2}
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    fullWidth
                />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={loading}>
                        Zmień hasło
                    </Button>
                    <Button variant="outlined" onClick={() => setIsEdited(false)}>
                        Anuluj
                    </Button>
                </Stack>

                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Box>

        </Box>
    );
};

export default ChangePassword;
