import React, {useEffect, useState} from "react";
import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import AddButton from "../common/AddButton";

import {
    Box, Alert, Card,
} from "@mui/material";
import TaskList from "../task/TaskList";
import paths from "../../paths";
import ProjecDetailsDump from "./ProjectDetailsDump";
import ReturnButton from "../common/ReturnButton";
import EditProject from "./EditProject";
import {fetchTasks} from "../fetchers";

const AddTaskButton = ({projectId}) => {
    return (
        <AddButton to={paths.createTask(projectId)} label={"Dodaj nowe zadanie"}/>
    )
}

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);

    const fetchProject = useCallback(async () => {
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
        }
    }, [projectId, token]);

    const getTasks = useCallback(async () => {
        const result = await fetchTasks(token, page, projectId);
        setTasks(result.results);

    }, [projectId, token, page]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    useEffect(() => {
        fetchProject();
        getTasks();
    }, [fetchProject, getTasks]);

    const handleProjectUpdate = () => {
        fetchProject();
    };


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


                {tasks && tasks.length > 0 &&
                    <TaskList
                        propTasks={tasks}
                    />}
            </>)}
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 2
            }}>
                <ReturnButton label={"Wróć do projektów"} to={paths.projectList}/>
                <AddTaskButton projectId={projectId}/>
            </Box>
        </Box>);
};

export default ProjectDetails;