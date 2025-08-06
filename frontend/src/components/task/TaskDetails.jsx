import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useNavigate, useParams} from "react-router";
import {
    Box,
    Alert
} from "@mui/material";
import EditTask from "./EditTask";
import TaskDetailsDump from "./TaskDetailsDump";
import AddButton from "../common/AddButton";
import paths from "../../paths";
import ReturnButton from "../common/ReturnButton";
import {endTaskTimelog, fetchTasks, startTaskTimelog, stopTaskTimelog} from "../fetchers";
import TaskListDump from "./TaskListDump";
import PaginationFrame from "../common/Pagination";


const TaskDetails = () => {
    const {taskId, projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate()

    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const [contextText, setContextText] = useState("zadania");
    const [isEditing, setIsEditing] = useState(false);
    const [subtasks, setSubtasks] = useState([]);
    const [subtasksPagination, setSubtasksPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});

    const fetchTask = useCallback(async () => {
        setError(null);
        try {
            const res = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`Nie udało się pobrać danych ${contextText}`);
            }

            const data = await res.json();
            setTask(data);
        } catch (err) {
            setError(err.message);
        }
    }, [taskId, token, contextText]);

    const getTasks = useCallback(async (page) => {
        const result = await fetchTasks(token, page, projectId, taskId);
        setSubtasks(result.results);
        setSubtasksPagination({
            next: result.next,
            prev: result.previous,
            pages: result.total_pages,
            currentPage: result.current_page
        })

    }, [projectId, token, taskId]);

    useEffect(() => {
    }, [fetchTask,]);

    useEffect(() => {
        getTasks(subtasksPagination.currentPage);
    }, [getTasks, subtasksPagination.currentPage]);

    useEffect(() => {
        if (task && 'parent_task' in task) {
            if (task.parent_task == null) {
                setContextText("zadania");
            } else {
                setContextText("podzadania");
            }
        }
    }, [task]);
    const handleTaskUpdate = (updatedTask) => {
        setTask(updatedTask);
    };

    const handleTaskStartOrPause = async (taskId) => {
        let result;
        if (task.status === "to_do") {
            result = await startTaskTimelog(taskId, token);
            if (result && result.start_time) {
                setTask(prev => ({
                    ...prev,
                    status: "in_progress",
                    start_time: result.start_time,
                }));
            }

        } else if (task.status === "in_progress") {
            result = await stopTaskTimelog(taskId, token);
            if (result && result.end_time) {
                setTask(prev => ({
                    ...prev,
                    status: "to_do",
                    stop_time: result.stop_time,
                }));
            }
        }
    }

    const handleEndTask = async (taskId) => {
        const result = await endTaskTimelog(taskId, token)
        if (result) {
            setTask(prev => ({
                ...prev,
                status: "completed",
                end_time: result.end_time,
            }));
        }
    }

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    }

    const handleDeleteSuccess = () => {
        if (task.parent_task) {
            navigate(paths.taskDetails(projectId, task.parent_task.id));
        } else {
            navigate(paths.project(projectId));
        }
    };

    const handleDeleteTaskSuccess = (taskId) => {
        setSubtasks(prev => prev.filter(task => task.id !== taskId));
    }

    const handleNavigate = (taskId) => {
        navigate(paths.taskDetails(projectId, taskId));
    }
    const handlePageChange = (page) => {
        setSubtasksPagination((prev) => ({
            ...prev,
            currentPage: page,
        }));
    };

    return (
        <Box sx={{mx: "auto", p: 0}}>
            {error && <Alert severity="error">{error}</Alert>}

            {task && (
                isEditing ? (
                    <EditTask
                        task={task}
                        handleTaskUpdate={handleTaskUpdate}
                        setIsEditing={setIsEditing}
                    />
                ) : (
                    <>
                        <TaskDetailsDump
                            key={task.id}
                            task={task}
                            handleDeleteSuccess={handleDeleteSuccess}
                            handleEditClick={handleEditClick}
                            handleTaskStartOrPause={handleTaskStartOrPause}
                            handleEndTask={handleEndTask}
                        />
                        <Box sx={{p: 3}}>
                            {subtasks && subtasks.length > 0 && (
                                <TaskListDump tasks={subtasks} handleDeleteSuccess={handleDeleteTaskSuccess}
                                              handleNavigate={handleNavigate}/>
                            )}

                            {task.parent_task && (
                                <ReturnButton
                                    label={"Wróć do zadania nadrzędnego"}
                                    to={paths.taskDetails(projectId, task.parent_task.id)}
                                />
                            )}

                            {!task.parent_task && (
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        mt: 2,
                                    }}
                                >
                                    <ReturnButton
                                        label={"Wróć do projektu"}
                                        to={paths.project(projectId)}
                                    />
                                    <PaginationFrame pagination={subtasksPagination} handleChange={handlePageChange}/>
                                    <AddButton
                                        label={"Dodaj podzadanie"}
                                        to={paths.createSubtask(projectId, taskId)}
                                    />
                                </Box>
                            )}
                        </Box>
                    </>
                )
            )}
        </Box>
    );
};

export default TaskDetails;
