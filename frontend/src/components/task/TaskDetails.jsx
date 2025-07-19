import React, {useEffect, useState} from "react";
import {useParams, Link, useNavigate} from "react-router";
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

const TaskDetails = () => {
    const {taskId} = useParams();
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
            <Typography variant="h5" gutterBottom>
                Szczegóły zadania
            </Typography>

            <Typography><strong>Tytuł:</strong> {task.title}</Typography>
            <Typography><strong>Opis:</strong> {task.description || "Brak opisu"}</Typography>
            <Typography><strong>Status:</strong> {statusLabels[task.status]}</Typography>
            <Typography><strong>Priorytet:</strong> {priorityLabels[task.priority]}</Typography>
            <Typography><strong>Termin wykonania:</strong> {task.due_date}</Typography>
            <Typography><strong>Wersja projektu:</strong> {task.project_version}</Typography>
            <Typography><strong>Użytkownik przypisany:</strong> {task.user ? task.user.username : "Brak"}</Typography>
            <Typography><strong>Projekt:</strong> {task.project?.name || "Brak"}</Typography>

            {task.parent_task && (
                <Typography><strong>Zadanie nadrzędne (ID):</strong> {task.parent_task}</Typography>
            )}

            <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                    Podzadania ({task.subtasks?.length || 0})
                </Typography>

                {task.subtasks?.length > 0 ? (
                    <List disablePadding>
                        {task.subtasks.map((subtask) => (
                            <React.Fragment key={subtask.id}>
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
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        Brak podzadań.
                    </Typography>
                )}
            </Box>

            <Box mt={4} display="flex" gap={2} flexWrap="wrap">
                <Button component={Link} to={`/project/${task.project?.id}/tasks`} variant="outlined">

                    &larr; Powrót do listy zadań
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/tasks/${taskId}/subtasks/create`)}
                >
                    Dodaj podzadanie
                </Button>
            </Box>
        </Box>
    );
};

export default TaskDetails;