import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {Link} from "react-router";
import {
    Typography,
    List,
    ListItem,
    Paper,
    Box,
    CircularProgress,
    Alert,
    Stack, Button,
} from "@mui/material";
import paths from "../../paths";
import AutoDismissAlert from "../common/AutoDismissAlert";

const UserProjectsList = () => {
    const token = useAuthStore(state => state.token);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}projects/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać projektów");
                }

                const data = await res.json();
                setProjects(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [token]);

    if (loading) return <CircularProgress sx={{m: 4}}/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Twoje projekty
            </Typography>

            <List>
                {projects.map((project) => (
                    <ListItem key={project.id} disableGutters sx={{mb: 2}}>
                        <Paper elevation={2} sx={{p: 2, width: '100%'}}>
                            <Stack spacing={1}>
                                <Typography
                                    variant="h6"
                                    component={Link}
                                    to={paths.project(project.id)}
                                    sx={{
                                        textDecoration: 'none',
                                        color: 'primary.main',
                                        '&:hover': {textDecoration: 'underline'},
                                    }}
                                >
                                    {project.name || "Bez nazwy"}
                                </Typography>

                                <Typography variant="body2">Status: {project.status}</Typography>
                                {project.description && (
                                    <Typography variant="body2">{project.description}</Typography>
                                )}
                                {project.budget && (
                                    <Typography variant="body2">Budżet: {project.budget} zł</Typography>
                                )}
                            </Stack>
                        </Paper>
                    </ListItem>
                ))}
            </List>
            <Box mt={2}>
                <Button
                    component={Link}
                    to={paths.createProject}
                    variant="contained"
                    color="primary"
                >
                    Utwórz nowy projekt
                </Button>
            </Box>
        </Box>
    );
};

export default UserProjectsList;
