import React from 'react';
import {Outlet} from 'react-router';
import Header from './Header';
import {Container, Box} from '@mui/material';
import Sidebar from "./Sidebar";

export default function Home() {
    return (
        <>
            <Box sx={{display: 'flex', flexDirection: 'row', position: 'relative', height: '100vh'}}>
                {/* Sidebar po lewej */}
                <Sidebar/>

                {/* Prawa czê¶æ: Header na górze, Outlet pod spodem */}
                <Box sx={{flexGrow: 1, display: 'flex', flexDirection: 'column', width: '100%'}}>
                    <Header/>

                    <Container maxWidth="lg" sx={{flexGrow: 1, overflowY: 'auto', py: 4}}>
                        <Outlet/>
                    </Container>
                </Box>
            </Box>
        </>
    );
}