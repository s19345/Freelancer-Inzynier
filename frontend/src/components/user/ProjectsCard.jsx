import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack
} from "@mui/material";
import {PROJECT_BACKEND_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";

const getStatusColor = (status) => {
    switch (status) {
        case "active":
            return "success";
        case "completed":
            return "error";
        case "paused":
            return "warning";
        default:
            return "default";
    }
};

const ProjectsCard = () => {
    const token = useAuthStore((state) => state.token);
    const [projects, setProjects] = useState([]);

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
            }
        };

        fetchProjects();
    }, [token]);


    return (
        <Box
            width="auto"
            maxWidth={800}
            bgcolor="#fcfdff"
            borderRadius={4}
            boxShadow={"0px 3px 35px rgba(0, 0, 0, 0.08)"}
            sx={{}}
            p={3}
        >
            <Typography variant="h6" fontWeight="bold" mb={2}>
                Projekty użytkownika
            </Typography>

            <Grid container spacing={2}>
                {projects.slice(0, 6).map((project) => (
                    <Grid xs={12} sm={6} md={4} key={project.id}>
                        <Card
                            sx={{
                                aspectRatio: "1 / 1",
                                borderRadius: 3,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                p: 2,
                                width: 170
                            }}
                        >
                            <CardContent>
                                <Stack spacing={1}>
                                    <Typography
                                        variant="h6"
                                        fontWeight="bold"
                                        noWrap
                                        title={project.name}
                                        sx={{
                                            maxWidth: 90,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {project.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Wersja: {project.version}
                                    </Typography>
                                    <Chip
                                        label={project.status}
                                        color={getStatusColor(project.status)}
                                        size="small"
                                        sx={{width: "fit-content"}}
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProjectsCard;