import React, {useState, useEffect} from "react";
import {Box, TextField, Button, Typography, Alert, MenuItem} from "@mui/material";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../../settings";
import useAuthStore from "../../../zustand_store/authStore";

const CreateSubtaskForm = () => {
    const {taskId} = useParams();
    const token = useAuthStore((state) => state.token);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "to_do",
        due_date: "",
        priority: "medium",
        project_version: "1.0",
    });

    const [parentUser, setParentUser] = useState(null);
    const [parentProjectId, setParentProjectId] = useState(null);
    const [statusMsg, setStatusMsg] = useState(null);
    const [statusType, setStatusType] = useState("success");

    useEffect(() => {
        const fetchParentTask = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać zadania nadrzędnego");
                }

                const data = await res.json();
                setParentUser(data.user);
                setParentProjectId(data.project?.id || null);
            } catch (err) {
                console.error("Błąd ładowania zadania nadrzędnego:", err);
            }
        };

        fetchParentTask();
    }, [taskId, token]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            parent_task_id: Number(taskId),
            user_id: parentUser ? parentUser.id : null,
            project_id: parentProjectId,
        };

        console.log("Wysyłany payload:", JSON.stringify(payload, null, 2));

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}tasks/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                setStatusMsg("Podzadanie zostało utworzone");
                setStatusType("success");
                setFormData({
                    title: "",
                    description: "",
                    status: "to_do",
                    due_date: "",
                    priority: "medium",
                    project_version: "1.0",
                });
            } else {
                console.log("Response error data:", data);
                const msg = typeof data === "object"
                    ? Object.values(data).flat().join(" ")
                    : "Błąd tworzenia podzadania";
                setStatusMsg(msg);
                setStatusType("error");
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
            setStatusMsg("Błąd połączenia z serwerem");
            setStatusType("error");
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 500,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h2" textAlign="center">
                Dodaj podzadanie
            </Typography>

            <TextField
                label="Tytuł"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
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
                InputLabelProps={{shrink: true}}
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

            <Button type="submit" variant="contained" color="primary" fullWidth>
                Utwórz podzadanie
            </Button>

            {statusMsg && (
                <Alert variant="filled" severity={statusType}>
                    {statusMsg}
                </Alert>
            )}
        </Box>
    );
};

export default CreateSubtaskForm;

