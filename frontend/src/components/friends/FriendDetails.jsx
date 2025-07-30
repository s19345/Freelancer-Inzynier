import React, {useEffect, useState} from 'react';
import {
    Box,

    Grid,
    Typography,
    Paper
} from '@mui/material';
import {USERS_LIST_URL} from '../../settings';
import {useParams} from "react-router";
import useAuthStore from "../../zustand_store/authStore";


export default function FriendDetails() {
    const [user, setUser] = useState()
    const {friendId} = useParams();
    const token = useAuthStore((state) => state.token);


    useEffect(() => {
        const fetchUserDetails = async (id) => {
            try {
                const response = await fetch(`${USERS_LIST_URL}friends/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                console.log('Fetched user details:', data);
                setUser(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

        }

        fetchUserDetails(friendId);
    }, []);

    return (
        <Paper elevation={3} sx={{p: 4, borderRadius: 4, maxWidth: 900, mx: 'auto'}}>
            {user && (
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Full Name</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.first_name} {user.last_name}</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.email}</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Phone number</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.phone}</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Location/timezone</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.location} / {user.timezone}</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Specialization/skills</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.skills}</Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle2">Rate</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.rate}</Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Projects collaborated on</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary'}}>{user.project}</Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2">Notes</Typography>
                        <Box sx={{mt: 1, color: 'text.secondary', whiteSpace: 'pre-line'}}>
                            {user.notes}
                        </Box>
                    </Grid>
                </Grid>
            )}

        </Paper>
    );
}