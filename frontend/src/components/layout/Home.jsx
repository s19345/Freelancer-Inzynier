import React from 'react';
import {Outlet} from 'react-router';
import Header from './Header';
import {Container, Box} from '@mui/material';
import Sidebar from "./Sidebar";

export default function Home() {
    return (
        <>
            {/*<Header/>*/}
            <Box sx={{display: 'flex', flexDirection: 'row', position: "absolute",}}>
                <Sidebar/>
                <Container maxWidth="lg">
                    <Box component="main" py={4}>
                        <Outlet/>
                    </Box>
                </Container>
            </Box>
        </>
    );
}
