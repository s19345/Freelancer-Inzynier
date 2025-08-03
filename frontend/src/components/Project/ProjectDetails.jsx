import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import AddButton from "../common/AddButton";

import {
    Box, Alert,
} from "@mui/material";
import TaskList from "../task/TaskList";
import paths from "../../paths";
import ProjecDetailsDump from "./ProjectDetailsDump";
import ReturnButton from "../common/ReturnButton";
import EditProject from "./EditProject";

const AddTaskButton = ({projectId}) => {
    return (
        <AddButton to={paths.createTask(projectId)} label={"Dodaj nowe zadanie"}/>
    )
}

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

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

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    useEffect(() => {
            fetchProject();
        }, [projectId, token]
    );
    const handleProjectUpdate = () => {
        fetchProject();
    };


    if (error) return <Alert severity="error">Błąd: {error}</Alert>;


    return (
        <Box sx={{p: 0}}>
            {project && (<>

                {!isEditing && (
                    <ProjecDetailsDump
                        project={project}
                        handleUpdate={handleProjectUpdate}
                        handleEdit={handleEdit}
                    />
                )}
                {isEditing && (
                    <EditProject
                        handleUpdate={handleProjectUpdate}
                        project={project}
                        setIsEditing={setIsEditing}
                    />
                )}


                <TaskList
                    addTaskButton={<AddTaskButton projectId={projectId}/>}
                    returnButton={<ReturnButton label={"Wróć do projektów"} to={paths.projectList}/>}
                />
            </>)}
        </Box>);
};

export default ProjectDetails;