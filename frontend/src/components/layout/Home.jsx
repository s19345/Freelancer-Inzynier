import React from 'react';
import {Outlet} from 'react-router';
import Header from './Header';
import {Container, Box} from '@mui/material';

export default function Home() {
    return (
        <>
            <Header/>
            <Container maxWidth="lg">
                <Box component="main" py={4}>
                    <Outlet/>
                </Box>
            </Container>
        </>
    );
}
