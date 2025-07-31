import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import useGlobalStore from '../../zustand_store/globalInfoStore';
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../../settings";
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
    const navigate = useNavigate();
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
        collabolators: [],
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
    const [clietnsFethingError, setClientsFetchingError] = useState(null);
    const [clientsFetchingLoading, setClientsFetchingLoading] = useState(false);
    const [friends, setFriends] = useState([]);
    const [friendsFetchingError, setFriendsFetchingError] = useState(null);
    const [friendsFetchingLoading, setFriendsFetchingLoading] = useState(false);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
        if (!formData.status) newErrors.status = "Status projektu jest wymagany";
        if (formData.budget && Number(formData.budget) < 0)
            newErrors.budget = "Budżet nie może być ujemny";
        return newErrors;
    };

    const params = new URLSearchParams({page_size: 10000});

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

                if (!res.ok) throw new Error("Nie udało się pobrać klientów");
                const data = await res.json();
                console.log("Fetched clients:", data);
                setClients(data.results);
            } catch (err) {
                console.log("Error fetching clients:", err);
                setClientsFetchingError(err.message);
            } finally {
                setClientsFetchingLoading(false);
            }
        };
        fetchClients();
    }, [token]);

    useEffect(() => {
        setFriendsFetchingLoading(true);
        const fetchFriends = async () => {
            try {
                const res = await fetch(`${USERS_LIST_URL}friends/?${params}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Nie udało się pobrać znajomych");
                const data = await res.json();
                setFriends(data.results);
            } catch (err) {
                setFriendsFetchingError(err.message);
            } finally {
                setFriendsFetchingLoading(false);
            }
        };
        fetchFriends();
    }, [token]);

    const createProject = async (data) => {
        setLoading(true);
        try {
            console.log("Creating project with data:", data);
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
            console.log("Utworzono projekt:", responseData);
            setMessage("Projekt został utworzony pomyślnie");
            setType("success");
            navigate(paths.projectList);
        } catch (error) {
            console.error("Error creating project:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({...prev, [name]: value}));

        // waliduj zmieniane pole i zaktualizuj errors
        const fieldErrors = validate(name, value);

        setErrors((prevErrors) => {
            // usuń błąd dla tego pola, jeśli walidacja przeszła
            const updatedErrors = {...prevErrors, ...fieldErrors};

            // jeśli nie ma błędu dla pola, usuń go z obiektu errors
            if (!fieldErrors[name]) {
                delete updatedErrors[name];
            }

            return updatedErrors;
        });
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
            {clietnsFethingError && (
                <Alert severity="error">Błąd pobierania klientów: {clietnsFethingError}</Alert>
            )}
            {friendsFetchingError && (
                <Alert severity="error">Błąd pobierania znajomych: {friendsFetchingError}</Alert>
            )}

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
                            required
                            multiline
                            rows={4}
                            disabled={loading}
                        />

                        <TextField
                            label="Wersja"
                            name="version"
                            required
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
                            required
                            value={formData.budget}
                            onChange={handleChange}
                            error={!!errors.budget}
                            helperText={errors.budget}
                            disabled={loading}
                        />

                        <FormControl fullWidth error={!!errors.collabolators} disabled={loading}>
                            <InputLabel id="collabolators-label">Współpracownicy</InputLabel>
                            <Select
                                labelId="client-label"
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
                            {errors.client && <FormHelperText>{errors.client}</FormHelperText>}
                        </FormControl>

                        <FormControl fullWidth error={!!errors.collaborators} disabled={loading}>
                            <InputLabel id="collaborators-label">Współpracownicy</InputLabel>
                            <Select
                                labelId="collabolators-label"
                                name="collabolators"
                                multiple
                                value={formData.collabolators}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        collabolators: e.target.value,
                                    }))
                                }
                                label="Współpracownicy"
                                renderValue={(selected) =>
                                    friends
                                        .filter((f) => selected.includes(f.id))
                                        .map((f) => f.username)
                                        .join(", ")
                                }
                            >
                                {friends.map((friend) => (
                                    <MenuItem key={friend.id} value={friend.id}>
                                        {friend.username}
                                    </MenuItem>
                                ))}
                            </Select>
                            {errors.collabolators && (
                                <FormHelperText>{errors.collabolators}</FormHelperText>
                            )}
                        </FormControl>

                        {loading ? (
                            <CircularProgress size={24}/>
                        ) : (
                            <Box display="flex" justifyContent="space-between" gap={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
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
                            </Box>
                        )}
                    </Stack>
                </form>
            )}
        </Box>
    );
};

export default ProjectForm;
