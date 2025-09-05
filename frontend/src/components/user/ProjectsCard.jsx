import React, {useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Stack,
} from "@mui/material";
import {PROJECT_BACKEND_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";
import {useNavigate} from "react-router";
import paths from "../../paths";

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
    const navigate = useNavigate()
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

    const handleProjectClick = (id) => {
        navigate(paths.project(id))
    }

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
                {projects && projects.length > 0 ? (
                    projects.slice(0, 6).map((project) => (
                        <Grid xs={12} sm={6} md={4} key={project.id}>
                            <Card
                                sx={{
                                    aspectRatio: "1 / 1",
                                    borderRadius: 3,
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    p: 1,
                                    width: 170,
                                    cursor: "pointer",
                                }}
                                onClick={() => handleProjectClick(project.id)}
                            >
                                <CardContent sx={{p: 0}}>
                                    <Stack spacing={1} alignItems="center" sx={{p: 0}}>
                                        <Typography
                                            variant="body1"
                                            fontWeight="bold"
                                            // noWrap
                                            title={project.name}
                                            sx={{
                                                maxWidth: 160,
                                                textAlign: "center",
                                                overflow: "hidden",
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                wordBreak: "break-word",
                                            }}
                                        >
                                            {project.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {project.version}
                                        </Typography>
                                        <Chip
                                            label={project.status_display}
                                            color={getStatusColor(project.status)}
                                            size="small"
                                            sx={{width: "fit-content"}}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body1">Nie masz jeszcze projektów</Typography>
                )}
            </Grid>
        </Box>
    );
};

export default ProjectsCard;
