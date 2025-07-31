import React, {useState, useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {Box, Typography, TextField, Button, Alert, Stack} from '@mui/material';

const ChangePassword = ({setIsEdited}) => {
    const {loading, error, successMessage, resetError, changePassword} = useAuthStore();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");
    const [localError, setLocalError] = useState(null);


    useEffect(() => {
        return () => {
            resetError();
        };
    }, [resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword1 !== newPassword2) {
            setLocalError("Nowe has�a nie s� takie same!");
            return;
        }
        setLocalError(null);
        await changePassword({oldPassword, newPassword1, newPassword2});
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
                    Zmie� has�o
                </Typography>

                <TextField
                    label="Aktualne has�o"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Nowe has�o"
                    type="password"
                    value={newPassword1}
                    onChange={(e) => setNewPassword1(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    label="Powt�rz nowe has�o"
                    type="password"
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    required
                    fullWidth
                />

                <Stack direction="row" spacing={2}>
                    <Button type="submit" variant="contained" disabled={loading}>
                        Zmie� has�o
                    </Button>
                    <Button variant="outlined" onClick={() => setIsEdited(false)}>
                        Anuluj
                    </Button>
                </Stack>

                {localError && <Alert severity="error">{localError}</Alert>}
                {error && <Alert severity="error">{error}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Box>

        </Box>
    );
};

export default ChangePassword;