import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams, Link as RouterLink} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import AddButton from "../common/AddButton";

import {
    Box, Typography, Button, Alert,
} from "@mui/material";
import TaskList from "../task/TaskList";
import paths from "../../paths";
import ProjecDetailsDump from "./ProjectDetailsDump";

const ProjectDetails = () => {
        const {projectId} = useParams();
        const token = useAuthStore((state) => state.token);
        const [project, setProject] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        const fetchProject = async () => {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`, "Content-Type": "application/json"
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

        useEffect(() => {
                fetchProject();
            }, [projectId, token]
        )
        ;
        const handleProjectUpdate = () => {
            fetchProject()
        }


        if (error) return <Alert severity="error">Błąd: {error}</Alert>;


        return (
            <Box sx={{p: 0}}>
                {project && (<>

                    <ProjecDetailsDump project={project} handleUpdate={handleProjectUpdate}/>

                    <TaskList/>
                    <Box>

                        <AddButton to={paths.createTask(projectId)} label={"Dodaj nowe zadanie"}/>
                    </Box>
                </>)}
            </Box>);
    }
;

export default ProjectDetails;