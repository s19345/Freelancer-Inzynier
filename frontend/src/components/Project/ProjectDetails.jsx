import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams, Link} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";

import {
    Box,
    Typography,
    Button,
    Alert,
} from "@mui/material";
import TaskList from "../task/UserTaskList";
import EditProject from "./EditProject";
import AutoDismissAlert from "../common/AutoDismissAlert";
import DeleteProject from "./DeleteProject";

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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
                console.log(" pobieram projekt w pr detProjekt:", data);
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
    const handleUpdate = (updatedTask) => {
        setProject(updatedTask);
    };

    const finishEditing = () => {
        setIsEditing(false);
    }

    if (error) return <Alert severity="error">Błąd: {error}</Alert>;
    if (!project) return <Alert severity="warning">Projekt nie został znaleziony</Alert>;

    return (
        <Box sx={{p: 3}}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Szczegóły Projektu
                </Typography>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    size="small"
                    sx={{ml: 2}}
                >
                    Edytuj
                </Button>
                <Box flex={1}>
                    <DeleteProject projectId={projectId}/>
                </Box>
            </Box>
            {!isEditing ? (
                <>

                    <Typography variant="h4" gutterBottom>{project.name || "Bez nazwy"}</Typography>
                    <Typography><strong>Status:</strong> {project.status}</Typography>
                    <Typography><strong>Wersja:</strong> {project.version}</Typography>
                    <Typography><strong>Budżet:</strong> {project.budget} zł</Typography>
                    <Typography><strong>Opis:</strong> {project.description}</Typography>
                </>
            ) : (<EditProject finishEditing={finishEditing} handleUpdate={handleUpdate}/>)}
            {project.client && (
                <Typography><strong>Klient ID:</strong> {project.client}</Typography>
            )}
            <TaskList/>
        </Box>
    );
};

export default ProjectDetails;
