import React, {useCallback, useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useParams} from "react-router";
import {
    Box,
    Alert
} from "@mui/material";
import EditTask from "./EditTask";
import TaskList from "./TaskList";
import TaskDetailsDump from "./TaskDetailsDump";
import AddButton from "../common/AddButton";
import paths from "../../paths";
import ReturnButton from "../common/ReturnButton";
import {endTaskTimelog, startTaskTimelog, stopTaskTimelog} from "../fetchers";


const TaskDetails = () => {
    const {taskId, projectId} = useParams();
    const token = useAuthStore((state) => state.token);

    const [task, setTask] = useState(null);
    const [error, setError] = useState(null);
    const [contextText, setContextText] = useState("zadania");
    const [isEditing, setIsEditing] = useState(false);

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
                throw new Error(` Nie udało się pobrać danych ${contextText}`);
            }

            const data = await res.json();
            setTask(data);
        } catch (err) {
            setError(err.message);
        }
    }, [taskId, token, contextText]);

    useEffect(() => {
        fetchTask();
    }, [fetchTask]);

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
            result = await startTaskTimelog(taskId);
            if (result && result.start_time) {
                setTask(prev => ({
                    ...prev,
                    status: "in_progress",
                    start_time: result.start_time,
                }));
            }

        } else if (task.status === "in_progress") {
            console.log("zaraz zatrzymam to zadanie")
            result = await stopTaskTimelog(taskId);
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
        const result = await endTaskTimelog(taskId)
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

    const handleDeleteSuccess = (deletedId) => {
        setTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(subtask => subtask.id !== deletedId),
        }));
    };

    return (
        <Box sx={{mx: "auto", p: 0}}>
            {error && <Alert severity="error"> {error}</Alert>}
            {task &&
                <Card>
                    {isEditing ?
                        (<EditTask task={task} handleTaskUpdate={handleTaskUpdate} setIsEditing={setIsEditing}/>) :
                        (<TaskDetailsDump
                            task={task}
                            handleDeleteSuccess={handleDeleteSuccess}
                            handleEditClick={handleEditClick}
                            handleTaskStartOrPause={handleTaskStartOrPause}
                            handleEndTask={handleEndTask}
                        />)
                    }
                    {!task.parent_task && <TaskList
                        addTaskButton={<AddButton label={"Dodaj podzadanie"}
                                                  to={paths.createSubtask(projectId, taskId)}/>}
                        returnButton={<ReturnButton label={"Wróć do projektu"} to={paths.project(projectId)}/>}
                    />}

                </Card>
            }
            <Box sx={{p: 3}}>
                {task?.parent_task &&
                    <ReturnButton
                        label={"Wróć do zadania nadrzędnego"}
                        to={paths.taskDetails(projectId, task.parent_task.id)}
                    />}
            </Box>
        </Box>
    );
};

export default TaskDetails;
