import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import PasswordReset from './PasswordReset';
import useAuthStore from '../../zustand_store/authStore';
import {USERS_BACKEND_URL} from '../../settings';
import {Box, TextField, Button, Typography, Alert, Stack,} from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [showReset, setShowReset] = useState(false);
    const loading = useAuthStore(state => state.loading);
    const error = useAuthStore(state => state.error);
    const setLoading = useAuthStore(state => state.setLoading);
    const setError = useAuthStore(state => state.setError);
    const setToken = useAuthStore(state => state.setToken);
    const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);
    const fetchUser = useAuthStore(state => state.fetchUser);
    const loginUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${USERS_BACKEND_URL}login/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username: nickname, password: password,}),
            });
            if (res.ok) {
                const data = await res.json();
                setToken(data.key);
                setIsLoggedIn(true);
                fetchUser()
                navigate('/');
            } else {
                const err = await res.json();
                setError(err.non_field_errors?.[0] || 'Błędne dane logowania');
            }
        } catch (err) {
            console.error(err);
            setError('Błąd połączenia');
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };
    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} component="form" onSubmit={handleSubmit}> <Typography variant="h5"
                                                                                                         gutterBottom> Logowanie </Typography>
            <Stack spacing={2}> <TextField label="Nick" value={nickname} onChange={(e) => setNickname(e.target.value)}
                                           required fullWidth/> <TextField label="Hasło" type="password"
                                                                           value={password}
                                                                           onChange={(e) => setPassword(e.target.value)}
                                                                           required fullWidth/> <Button type="submit"
                                                                                                        variant="contained"
                                                                                                        disabled={loading}> Zaloguj </Button>
                <Button variant="text"
                        onClick={() => setShowReset((prev) => !prev)}>                    {showReset ? 'Ukryj reset hasła' : 'Zapomniałeś hasła?'}                </Button> {showReset &&
                    <PasswordReset/>} {error && <Alert severity="error">{error}</Alert>}            </Stack> </Box>);
};
export default Login;
