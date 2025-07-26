import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import useGlobalStore from '../../zustand_store/globalInfoStore';
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
    const navigate = useNavigate()
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

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
    const [clients, setClients] = useState([]);
    const [clietnsFethingError, setClientsFetchingError] = useState(null);
    const [clientsFetchingLoading, setClientsFetchingLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
        if (!formData.status) newErrors.status = "Status projektu jest wymagany";
        if (formData.budget && Number(formData.budget) < 0)
            newErrors.budget = "Budżet nie może być ujemny";
        return newErrors;
    };

    const params = new URLSearchParams({
        page_size: 10000,
    });

    useEffect(() => {
        setClientsFetchingLoading(true);
        const fetchClients = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}clients/?${params}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać klientów");
                }

                const data = await res.json();
                setClients(data.results);
            } catch (err) {
                setClientsFetchingError(err.message);
            } finally {
                setClientsFetchingLoading(false);
            }
        };

        fetchClients();
    }, [token]);


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
            setMessage("Projekt został utworzony pomyślnie");
            setType("success");
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

                        <FormControl fullWidth error={!!errors.client} disabled={loading}>
                            <InputLabel id="status-label">Klient</InputLabel>
                            <Select
                                labelId="status-label"
                                name="client"
                                value={formData.client}
                                label="Klient"
                                onChange={handleChange}
                            >
                                {clients.map((client) => (
                                    <MenuItem key={client.id} value={client.id}>
                                        {client.company_name} - {client.contact_person}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                        </FormControl>

                        <TextField
                            label="Współpracownicy"
                            name="collaborators"
                            value={formData.collaborators}
                            onChange={handleChange}
                            disabled={loading}
                        />

                        {loading ? <CircularProgress size={24}/> :
                            <Box display="flex" justifyContent="space-between" gap={2} alignItems="stretch">
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                >
                                    Zapisz projekt
                                </Button>
                                <Button
                                    component={Link}
                                    to={paths.projectList}
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                >
                                    Anuluj
                                </Button>
                            </Box>}
                    </Stack>
                </form>
            )}

        </Box>
    );
};

export default ProjectForm;