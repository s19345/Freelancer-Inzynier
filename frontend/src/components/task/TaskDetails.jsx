import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate, Link as RouterLink} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    List,
    ListItem,
    ListItemText,
    Chip,
    Divider
} from "@mui/material";
import DeleteTask from "./DeleteTask";
import paths from "../../paths";

const ReturnButton = ({to, text}) => {
    return (
        <Button component={Link} to={to} variant="outlined">
            {text}
        </Button>
    );
}

const TaskDetails = () => {
    const {taskId, projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const navigate = useNavigate();

    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                throw new Error("Nie udało się pobrać danych zadania");
            }

            const data = await res.json();
            setTask(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTask();
    }, [taskId, token]);

    useEffect(() => {
        console.log(task)
    }, [task]);

    const handleDeleteSuccess = (deletedId) => {
        setTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(subtask => subtask.id !== deletedId),
        }));
    };

    const statusLabels = {
        to_do: "Do zrobienia",
        in_progress: "W trakcie",
        completed: "Zakończone",
    };

    const priorityLabels = {
        low: "Niski",
        medium: "Średni",
        high: "Wysoki",
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!task) return <Typography>Nie znaleziono zadania.</Typography>;

    return (
        <Box sx={{maxWidth: 700, mx: "auto", p: 3}}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Typography variant="h5">
                    Szczegóły zadania
                </Typography>
                <Button
                    component={RouterLink}
                    to={paths.editTask(projectId, task.id)}
                    size="small"
                    sx={{ml: 2}}
                >
                    Edytuj
                </Button>
            </Box>

            <Typography><strong>Tytuł:</strong> {task.title}</Typography>
            <Typography><strong>Opis:</strong> {task.description || "Brak opisu"}</Typography>
            <Typography><strong>Status:</strong> {statusLabels[task.status]}</Typography>
            <Typography><strong>Priorytet:</strong> {priorityLabels[task.priority]}</Typography>
            <Typography><strong>Termin wykonania:</strong> {task.due_date}</Typography>
            <Typography><strong>Wersja projektu:</strong> {task.project_version}</Typography>
            <Typography><strong>Użytkownik przypisany:</strong> {task.user ? task.user.username : "Brak"}</Typography>
            <Typography><strong>Projekt:</strong> {task.project?.name || "Brak"}</Typography>

            {task.parent_task && (
                <Typography><strong>Zadanie nadrzędne:</strong> {task.parent_task.title}</Typography>
            )}

            {task.subtasks?.length > 0 &&
                <Box mt={4}>
                    <Typography variant="h6" gutterBottom>
                        Podzadania ({task.subtasks?.length})
                    </Typography>
                    <List disablePadding>
                        {task.subtasks.map((subtask) => (
                            <React.Fragment key={subtask?.id}>
                                <ListItem
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        px: 0
                                    }}
                                >
                                    <ListItemText
                                        primary={subtask.title}
                                        secondary={`Termin: ${subtask.due_date}`}
                                    />
                                    <Button
                                        component={RouterLink}
                                        to={paths.taskDetails(projectId, subtask.id)}
                                        size="small"
                                        sx={{mr: 1}}
                                    >
                                        Szczegóły
                                    </Button>
                                    <Button
                                        component={RouterLink}
                                        to={paths.editTask(projectId, subtask.id)}
                                        size="small"
                                        sx={{mr: 1}}
                                    >
                                        Edytuj
                                    </Button>
                                    <DeleteTask
                                        taskId={subtask.id}
                                        onDeleteSuccess={() => handleDeleteSuccess(subtask.id)}
                                    />
                                    <Chip
                                        label={statusLabels[subtask.status]}
                                        color={
                                            subtask.status === "completed"
                                                ? "success"
                                                : subtask.status === "in_progress"
                                                    ? "warning"
                                                    : "default"
                                        }
                                        variant="outlined"
                                    />
                                </ListItem>
                                <Divider/>
                            </React.Fragment>
                        ))}
                    </List>
                </Box>
            }
            {task.parent_task ? (
                    <ReturnButton to={paths.taskDetails(projectId, task.parent_task.id)}
                                  text="Powrót do zadania nadrzędnego"/>) :
                (<Box mt={3} display="flex" gap={2} flexWrap="wrap">
                    <ReturnButton to={paths.project(projectId)} text="Powrót do projektu"/>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(paths.createSubtask(projectId, taskId))}
                    >
                        Dodaj podzadanie
                    </Button>
                </Box>)}
        </Box>
    )
        ;
};

export default TaskDetails;