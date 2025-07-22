import React, {useEffect, useState} from "react";
import {Link as RouterLink, useParams} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import DeleteTask from "./DeleteTask";

import {
    Box,
    Button,
    CircularProgress,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
} from "@mui/material";
import paths from "../../paths";

const TaskList = () => {
    const {projectId} = useParams();
    const token = useAuthStore(state => state.token);
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setProject(null);
    }, [projectId]);


    useEffect(() => {
        const fetchProject = async () => {
            if (!projectId) return;

            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać projektu");
                }

                const data = await res.json();
                setProject(data);
            } catch (err) {
                console.error("Błąd ładowania projektu:", err);
            }
        };

        fetchProject();
    }, [projectId, token]);


    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const url = projectId
                    ? `${PROJECT_BACKEND_URL}tasks/?project=${projectId}&parent_task=null`
                    : `${PROJECT_BACKEND_URL}tasks/?parent_task=null`;

                const res = await fetch(url, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać zadań");
                }

                const data = await res.json();

                const onlyRootTasks = data.filter(task => !task.parent_task);

                setTasks(onlyRootTasks);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [token, projectId]);


    const handleDeleteSuccess = (deletedId) => {
        setTasks(prev => prev.filter(task => task.id !== deletedId));
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Typography color="error">Błąd: {error}</Typography>;

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h5" gutterBottom>
                Lista zadań
            </Typography>

            {tasks.length === 0 ? (
                <Typography mb={2}>Brak zadań do wyświetlenia.</Typography>
            ) : (
                <Paper sx={{mb: 2}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Tytuł</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Priorytet</TableCell>
                                <TableCell>Termin</TableCell>
                                <TableCell>Akcje</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasks.map(task => (
                                <TableRow key={task.id}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.status}</TableCell>
                                    <TableCell>{task.priority}</TableCell>
                                    <TableCell>{task.due_date}</TableCell>
                                    <TableCell>
                                        <Button
                                            component={RouterLink}
                                            to={paths.taskDetails(projectId, task.id)}
                                            size="small"
                                            sx={{mr: 1}}
                                        >
                                            Szczegóły
                                        </Button>
                                        <DeleteTask
                                            taskId={task.id}
                                            onDeleteSuccess={() => handleDeleteSuccess(task.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            )}

            <Box>
                <Button
                    variant="contained"
                    component={RouterLink}
                    to={paths.createTask(projectId)}
                >
                    Dodaj zadanie do projektu
                </Button>
            </Box>
        </Box>
    );
};

export default TaskList;

