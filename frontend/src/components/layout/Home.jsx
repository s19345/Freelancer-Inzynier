import React from 'react';
import {Outlet} from 'react-router';
import Header from './Header';
import {Container, Box} from '@mui/material';
import Sidebar from "./Sidebar";
import useAuthStore from "../../zustand_store/authStore";

export default function Home() {
    const isLoggedIn = useAuthStore(state => state.isLoggedIn);
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', position: 'relative', height: '100vh'}}>
                {isLoggedIn &&
                    <Sidebar/>
                }
                <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%'}}>
                    {isLoggedIn && <Header/> }

                    <Container maxWidth="lg" sx={{flexGrow: 1, overflowY: 'auto', py: 4}}>
                        <Outlet/>
                    </Container>
                </Box>
            </Box>
        </>
    );
}