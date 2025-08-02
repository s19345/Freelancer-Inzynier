import React, {useEffect, useState} from "react";
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


const TaskDetails = () => {
    const {taskId, projectId} = useParams();
    const token = useAuthStore((state) => state.token);

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [contextText, setContextText] = useState("zadania");
    const [isEditing, setIsEditing] = useState(false);

    const fetchTask = async () => {
        setLoading(true);
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
            console.log("Error fetching task:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTask();

    }, [taskId, token]);

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
    const finishEditing = () => {
        setIsEditing(false);
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
                    {isEditing ? (<EditTask finishEditing={finishEditing} handleTaskUpdate={handleTaskUpdate}/>) :
                        (<TaskDetailsDump task={task} handleDeleteSuccess={handleDeleteSuccess}
                                          handleEditClick={handleEditClick}/>)
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
