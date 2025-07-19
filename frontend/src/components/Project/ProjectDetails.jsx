import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams, Link} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import CreateTask from "../task/CreateTask";

import {
    Box,
    Typography,
    Button,
    CircularProgress,
    Alert,
} from "@mui/material";

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateTask, setShowCreateTask] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych projektu");
                }

                const data = await response.json();
                setProject(data);
            } catch (err) {
                console.error("Błąd:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

    const handleTaskCreated = (newTask) => {
        console.log("Dodano nowe zadanie:", newTask);
        setShowCreateTask(false);
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">Błąd: {error}</Alert>;
    if (!project) return <Alert severity="warning">Projekt nie został znaleziony</Alert>;

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" gutterBottom>{project.name || "Bez nazwy"}</Typography>

            <Typography><strong>Status:</strong> {project.status}</Typography>
            <Typography><strong>Wersja:</strong> {project.version}</Typography>
            <Typography><strong>Budżet:</strong> {project.budget} zł</Typography>
            <Typography><strong>Opis:</strong> {project.description}</Typography>
            {project.client && (
                <Typography><strong>Klient ID:</strong> {project.client}</Typography>
            )}

            <Box mt={2}>
                <Button
                    variant="outlined"
                    component={Link}
                    to={`/project/${projectId}/edit`}
                >
                    Edytuj projekt
                </Button>
            </Box>

            <Box mt={3}>
                <Button
                    variant="outlined"
                    onClick={() => setShowCreateTask(prev => !prev)}
                >
                    Dodaj nowe zadanie
                </Button>
            </Box>

            {showCreateTask && (
                <Box mt={3}>
                    <CreateTask projectId={projectId} onTaskCreated={handleTaskCreated}/>
                </Box>
            )}
        </Box>
    );
};

export default ProjectDetails;
