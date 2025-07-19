import React, {useState, useEffect} from "react";
import {Box, TextField, Button, Typography, Alert, MenuItem} from '@mui/material';
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../../settings";
import {useParams} from "react-router";

const CreateTaskForm = ({projectId: propProjectId}) => {
    const {projectId: paramProjectId} = useParams();
    const projectId = propProjectId || paramProjectId;

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "to_do",
        due_date: "",
        project_version: "",
        priority: "medium",
        user: "",
        parent_task: "",
    });

    const [errors, setErrors] = useState({});
    const [statusMsg, setStatusMsg] = useState(null);
    const [statusType, setStatusType] = useState("success");
    const [users, setUsers] = useState([]);
    const token = useAuthStore(state => state.token);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch(`${USERS_LIST_URL}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Nie udało się pobrać użytkowników");

                const data = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Błąd ładowania użytkowników:", err);
            }
        };

        fetchUsers();
    }, [token]);

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tytuł jest wymagany";
        if (!formData.due_date) newErrors.due_date = "Termin wykonania jest wymagany";
        if (!formData.project_version.trim()) newErrors.project_version = "Wersja projektu jest wymagana";
        return newErrors;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            const payload = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                due_date: formData.due_date,
                project_version: formData.project_version,
                priority: formData.priority,
                project_id: parseInt(projectId),
                user: formData.user || null,
            };


            if (formData.parent_task) {
                payload.parent_task_id = formData.parent_task;
            }

            console.log("Wysyłane dane do API:", JSON.stringify(payload, null, 2));

            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}tasks/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();

                if (response.ok) {
                    setStatusMsg("Zadanie zostało utworzone");
                    setStatusType("success");
                    setFormData({
                        title: "",
                        description: "",
                        status: "to_do",
                        due_date: "",
                        project_version: "",
                        priority: "medium",
                        user: "",
                        parent_task: "",
                    });
                } else {
                    const errorMessage = typeof data === "object"
                        ? Object.values(data).flat().join(" ")
                        : "Wystąpił błąd podczas tworzenia zadania";
                    setStatusMsg(errorMessage);
                    setStatusType("error");
                }
            } catch (error) {
                console.error("Błąd sieci:", error);
                setStatusMsg("Błąd połączenia z serwerem");
                setStatusType("error");
            }
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h2" textAlign="center">
                Dodaj zadanie
            </Typography>

            <TextField
                label="Tytuł"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                fullWidth
            />

            <TextField
                label="Opis"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />

            <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value="to_do">Do zrobienia</MenuItem>
                <MenuItem value="in_progress">W trakcie</MenuItem>
                <MenuItem value="completed">Zakończone</MenuItem>
            </TextField>

            <TextField
                label="Termin wykonania"
                name="due_date"
                type="date"
                value={formData.due_date}
                onChange={handleChange}
                error={!!errors.due_date}
                helperText={errors.due_date}
                InputLabelProps={{shrink: true}}
                fullWidth
            />

            <TextField
                label="Wersja projektu"
                name="project_version"
                value={formData.project_version}
                onChange={handleChange}
                error={!!errors.project_version}
                helperText={errors.project_version}
                fullWidth
            />

            <TextField
                select
                label="Priorytet"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value="low">Niski</MenuItem>
                <MenuItem value="medium">Średni</MenuItem>
                <MenuItem value="high">Wysoki</MenuItem>
            </TextField>

            <TextField
                select
                label="Przypisz do użytkownika (opcjonalnie)"
                name="user"
                value={formData.user}
                onChange={handleChange}
                fullWidth
            >
                <MenuItem value="">— Brak —</MenuItem>
                {users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                        {user.username}
                    </MenuItem>
                ))}
            </TextField>

            <Button type="submit" variant="contained" color="primary" fullWidth>
                Utwórz zadanie
            </Button>

            {statusMsg && (
                <Alert variant="filled" severity={statusType}>
                    {statusMsg}
                </Alert>
            )}
        </Box>
    );
};

export default CreateTaskForm;

