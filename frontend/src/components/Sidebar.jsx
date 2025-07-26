import React from 'react';
import {Link as RouterLink} from 'react-router';
import paths from '../paths';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    Typography,
    Divider,
    Box
} from '@mui/material';

const drawerWidth = 240;

export default function Sidebar() {
    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
        >
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Sidebar
                </Typography>
            </Toolbar>
            <Divider/>
            <Box sx={{overflow: 'auto'}}>
                <List>
                    <ListItem button component="a" href="#dashboard">
                        <ListItemText primary="Dashboard"/>
                    </ListItem>
                    <ListItem button component={RouterLink} to={paths.project}>
                        <ListItemText primary="Projects"/>
                    </ListItem>
                    <ListItem button component={RouterLink} to={paths.clients}>
                        <ListItemText primary="Clients"/>
                    </ListItem>
                    <ListItem button component="a" href="#calendar">
                        <ListItemText primary="Calendar"/>
                    </ListItem>
                    <ListItem button component={RouterLink} to={paths.createProject}>
                        <ListItemText primary="Stwórz projekt"/>
                    </ListItem>
                    <ListItem button component={RouterLink} to={paths.createClient}>
                        <ListItemText primary="Stwórz klienta"/>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
}
