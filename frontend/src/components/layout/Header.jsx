import React from 'react';
import {Link} from 'react-router';
import useAuthStore from "../../zustand_store/authStore";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Stack,
    Box,
} from '@mui/material';

const Header = () => {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    const user = useAuthStore(state => state.user);

    return (
        <AppBar position="static" sx={{backgroundColor: '#333'}}>
            <Toolbar sx={{justifyContent: 'space-between'}}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        color: 'white',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                    }}
                >
                    MyApp
                </Typography>

                <Stack direction="row" spacing={2}>
                    <Button component={Link} to="/" sx={{color: 'white'}}>
                        Dashboard
                    </Button>

                    {!isLoggedIn ? (
                        <>
                            <Button component={Link} to="/login" sx={{color: 'white'}}>
                                Logowanie
                            </Button>
                            <Button component={Link} to="/register" sx={{color: 'white'}}>
                                Rejestracja
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/profile" sx={{color: 'white'}}>
                                {user?.nickname || 'Profil'}
                            </Button>
                            <Button component={Link} to="/logout" sx={{color: 'white'}}>
                                Wyloguj
                            </Button>
                        </>
                    )}
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
