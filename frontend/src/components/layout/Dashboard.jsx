import React from 'react';
import Sidebar from '../Sidebar'
import SearchField from '../SearchField'
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Container,
    Grid,
    Paper,
} from '@mui/material';

export default function Dashboard() {
    return (
        <Box sx={{display: 'flex'}}>
            {/* Sidebar */}
            {/*<Sidebar />*/}

            {/* Main content area */}
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                {/* Header with AppBar */}
                <AppBar position="static" color="default" elevation={1}>
                    <Toolbar sx={{justifyContent: 'space-between'}}>
                        <Typography variant="h6" component="div">
                            My Dashboard
                        </Typography>
                        <SearchField/>
                    </Toolbar>
                </AppBar>

                {/* Main Content */}
                <Container maxWidth="lg" sx={{mt: 4}}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper elevation={2} sx={{p: 3}}>
                                <Typography variant="h5" gutterBottom>
                                    Dashboard
                                </Typography>
                                <Typography>Welcome to the dashboard!</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
