import React, {useEffect, useState} from "react";
import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useNavigate, useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import AddButton from "../common/AddButton";

import {
    Box
} from "@mui/material";
import paths from "../../paths";
import ProjecDetailsDump from "./ProjectDetailsDump";
import ReturnButton from "../common/ReturnButton";
import EditProject from "./EditProject";
import {fetchTasks} from "../fetchers";
import PaginationFrame from "../common/Pagination";
import TaskListDump from "../task/TaskListDump";

const AddTaskButton = ({projectId}) => {
    return (
        <AddButton to={paths.createTask(projectId)} label={"Dodaj nowe zadanie"}/>
    )
}

const ProjectDetails = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const [project, setProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [tasksPagination, setTasksPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});
    const navigate = useNavigate()

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
        }
    }, [projectId, token]);

    const getTasks = useCallback(async (page) => {
        const result = await fetchTasks(token, page, projectId);
        setTasks(result.results);
        setTasksPagination({
            next: result.next,
            prev: result.previous,
            pages: result.total_pages,
            currentPage: result.current_page
        });

    }, [projectId, token]);

    const handleEdit = () => {
        setIsEditing(!isEditing);
    }

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    useEffect(() => {
        getTasks(tasksPagination.currentPage);
    }, [getTasks, tasksPagination.currentPage]);

    const handleTasksPageChange = (page) => {
        setTasksPagination(
            prev => ({...prev, currentPage: page})
        )
    }

    const handleTaskDeleteSuccess = (taskId) => {
        setTasks(prev => prev.filter(task => task.id !== taskId));
    }

    const handleProjectUpdate = () => {
        fetchProject();
    };

    const handleTaskNavigate = (taskId) => {
        navigate(paths.taskDetails(projectId, taskId));
    }


    return (
        <Box sx={{p: 0}}>
            {project && (<>

                {!isEditing && (<>
                        <ProjecDetailsDump
                            project={project}
                            handleUpdate={handleProjectUpdate}
                            handleEdit={handleEdit}
                        />
                        {tasks && tasks.length > 0 &&
                            <TaskListDump tasks={tasks} handleDeleteSuccess={handleTaskDeleteSuccess}
                                          handleNavigate={handleTaskNavigate}/>
                        }
                        <Box sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <ReturnButton label={"Wróć do projektów"} to={paths.projectList}/>
                            <PaginationFrame pagination={tasksPagination} handleChange={handleTasksPageChange}/>
                            <AddTaskButton projectId={projectId}/>
                        </Box>
                    </>
                )}
                {isEditing && (
                    <EditProject
                        handleUpdate={handleProjectUpdate}
                        project={project}
                        setIsEditing={setIsEditing}
                    />
                )}

            </>)}
        </Box>);
};

export default ProjectDetails;