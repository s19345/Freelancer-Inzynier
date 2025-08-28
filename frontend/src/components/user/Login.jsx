import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import PasswordReset from './PasswordReset';
import useAuthStore from '../../zustand_store/authStore';
import {USERS_BACKEND_URL} from '../../settings';
import {
    Box,
    TextField,
    Button,
    Typography,
    Alert,
    Stack,
} from '@mui/material';
import paths from "../../paths";

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
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!nickname) newErrors.nickname = 'Nick jest wymagany';
        if (!password) newErrors.password = 'Hasło jest wymagane';
        return newErrors;
    }

    const loginUser = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${USERS_BACKEND_URL}login/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: nickname,
                    password: password,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setToken(data.key);
                setIsLoggedIn(true);
                fetchUser()
                navigate(paths.dashboard);
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
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});
        loginUser();
    };

    function handleRegisterClick() {
        navigate(paths.register);
    }

    const handleResetClick = () => {
        setShowReset((prev) => !prev);
        // setNickname(null);
        // setPassword(null);
    }

    return (
        <Box maxWidth={400} mx="auto" mt={8} p={4} component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h5" gutterBottom>
                Logowanie
            </Typography>

            <Stack spacing={2}>
                <TextField
                    label="Nick"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    error={!!errors.nickname}
                    helperText={errors.nickname}
                    fullWidth
                />

                <TextField
                    label="Hasło"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!errors.password}
                    helperText={errors.password}
                    required
                    fullWidth
                />

                <Button type="submit" variant="contained" disabled={loading}>
                    Zaloguj
                </Button>

                <Button
                    variant="text"
                    onClick={() => handleResetClick()}
                >
                    {showReset ? 'Ukryj reset hasła' : 'Zapomniałeś hasła?'}
                </Button>
                <Button
                    variant="text"
                    onClick={() => handleRegisterClick()}
                >
                    Nie masz konta? Zarejestruj się
                </Button>
                {showReset && <PasswordReset/>}

                {error && <Alert severity="error">{error}</Alert>}
            </Stack>
        </Box>
    );
};

export default Login;
