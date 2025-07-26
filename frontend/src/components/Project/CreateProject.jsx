import React, {useState} from "react";
import {useNavigate} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    TextField,
    Typography,
    Alert,
    Stack,
    InputLabel,
    FormControl,
    FormHelperText
} from "@mui/material";
import paths from "../../paths";

const ProjectForm = () => {
    const token = useAuthStore(state => state.token);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        title: "",
        status: "",
        budget: "",
        client: "",
        collaborators: "",
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
        if (!formData.status) newErrors.status = "Status projektu jest wymagany";
        if (formData.budget && Number(formData.budget) < 0)
            newErrors.budget = "Budżet nie może być ujemny";
        return newErrors;
    };

    const createProject = async (data) => {
        setLoading(true);
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Błąd:", errorData);
                return;
            }

            const responseData = await response.json();
            setSuccessMessage("Projekt został utworzony pomyślnie");
            navigate(paths.projectList)
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            createProject(formData);
        }
    };

    return (
        <Box sx={{maxWidth: 600, mx: "auto", mt: 4}}>
            {!successMessage && (
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <Typography variant="h5">Utwórz projekt</Typography>

                        <TextField
                            label="Nazwa projektu"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={loading}
                        />

                        <TextField
                            label="Opis"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            disabled={loading}
                        />

                        <TextField
                            label="Wersja"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <FormControl fullWidth error={!!errors.status} disabled={loading}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                name="status"
                                value={formData.status}
                                label="Status"
                                onChange={handleChange}
                                required
                            >
                                <MenuItem value="">-- Wybierz status --</MenuItem>
                                <MenuItem value="active">Aktywny</MenuItem>
                                <MenuItem value="completed">Ukończony</MenuItem>
                                <MenuItem value="paused">Wstrzymany</MenuItem>
                            </Select>
                            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Budżet (PLN)"
                            name="budget"
                            type="number"
                            value={formData.budget}
                            onChange={handleChange}
                            error={!!errors.budget}
                            helperText={errors.budget}
                            disabled={loading}
                        />

                        <TextField
                            label="Klient"
                            name="client"
                            value={formData.client}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <TextField
                            label="Współpracownicy"
                            name="collaborators"
                            value={formData.collaborators}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24}/> : "Zapisz projekt"}
                        </Button>
                    </Stack>
                </form>
            )}

            {successMessage && (
                <Alert severity="success" sx={{mt: 3}}>
                    {successMessage}
                </Alert>
            )}
        </Box>
    );
};

export default ProjectForm;
