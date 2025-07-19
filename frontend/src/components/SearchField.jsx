import React from 'react';
import axios from 'axios';
import {TextField, Button, Box, Stack} from '@mui/material';

function SearchField() {
    const getProjectData = async () => {
        try {
            const response = await axios.get('adres url backendu');
            if (response.status === 200) {
                const data = response.data;
                console.log("Dane projektu:", data);
            }
        } catch (error) {
            console.error("Error fetching project data:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Search button clicked");
        getProjectData();
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <Stack direction="row" spacing={2}>
                <TextField
                    variant="outlined"
                    placeholder="Search..."
                    fullWidth
                    size="small"
                />
                <Button type="submit" variant="contained">
                    Search
                </Button>
            </Stack>
        </Box>
    );
}

export default SearchField;
