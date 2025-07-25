import React, {useState, useEffect} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL} from "../../settings";
import DeleteProject from "./DeleteProject";
import {
    Box,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Alert,
    MenuItem,
} from "@mui/material";

const EditProject = () => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        status: "",
        budget: "",
        client: "",
        collaborators: []
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitStatus, setSubmitStatus] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!response.ok) {
                    throw new Error("Nie udało się pobrać danych projektu");
                }

                const data = await response.json();

                setFormData({
                    name: data.name || "",
                    description: data.description || "",
                    version: data.version || "",
                    status: data.status || "",
                    budget: data.budget || "",
                    client: data.client || "",
                    collaborators: data.collaborators || []
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (name === "collaborators") {
            setFormData((prev) => ({
                ...prev,
                collaborators: value.split(",").map((c) => c.trim())
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Błąd aktualizacji projektu");
            }

            await response.json();
            setSubmitStatus("Projekt został zaktualizowany pomyślnie!");

        } catch (err) {
            setSubmitStatus(`Błąd: ${err.message}`);
        }
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{maxWidth: 600, mx: "auto", mt: 4, p: 3}}>
            <Typography variant="h5" gutterBottom>
                Edytuj projekt
            </Typography>

            {submitStatus && (
                <Alert severity={submitStatus.startsWith("Błąd") ? "error" : "success"} sx={{mb: 2}}>
                    {submitStatus}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>

                <TextField
                    label="Nazwa projektu"
                    name="name"
                    value={formData.name}
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
                    label="Wersja"
                    name="version"
                    value={formData.version}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    select
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    fullWidth
                >
                    <MenuItem value="active">Aktywny</MenuItem>
                    <MenuItem value="completed">Ukończony</MenuItem>
                    <MenuItem value="paused">Wstrzymany</MenuItem>
                </TextField>

                <TextField
                    label="Budżet"
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Klient (ID)"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    fullWidth
                />

                <TextField
                    label="Współpracownicy (oddziel przecinkami)"
                    name="collaborators"
                    value={formData.collaborators.join(", ")}
                    onChange={handleChange}
                    fullWidth
                />

                <Button variant="contained" type="submit">
                    Zapisz zmiany
                </Button>
            </Box>

            <Box mt={4}>
                <DeleteProject projectId={projectId}/>
            </Box>
        </Box>
    );
};