import React, {useState, useEffect} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../../settings";
import DeleteProject from "./DeleteProject";
import {
    Box,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Alert,
    MenuItem, InputLabel, Select, FormHelperText, FormControl,
} from "@mui/material";
import useGlobalStore from "../../zustand_store/globalInfoStore";

const EditProject = ({finishEditing, handleUpdate}) => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);
    const [friends, setFriends] = useState([]);

    const [errors, setErrors] = useState({});
    const [clients, setClients] = useState([]);
    const [clietnsFethingError, setClientsFetchingError] = useState(null);
    const [clientsFetchingLoading, setClientsFetchingLoading] = useState(false);
    const [friendsFetchingError, setFriendsFetchingError] = useState(null);
    const [friendsFetchingLoading, setFriendsFetchingLoading] = useState(false);
    const params = new URLSearchParams({page_size: 10000});

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        version: "",
        status: "",
        budget: "",
        client: "",
        collabolators: []
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
                    collabolators: data.collabolators.map(c => c.id) || []
                });

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, token]);

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
                setClients(data.results);
            } catch (err) {
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

    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus(null);

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "PATCH",
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

            const data = await response.json();
            console.log("Zaktualizowany projekt:", data);
            setMessage("Projekt został zaktualizowany pomyślnie");
            setType("success");

        } catch (err) {
            setSubmitStatus(`Błąd: ${err.message}`);
        } finally {
            setLoading(false);
            finishEditing()
        }
    };

    if (loading) return <CircularProgress/>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{maxWidth: 600, mx: "auto", mt: 4, p: 3}}>

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

                <FormControl fullWidth error={!!errors.client} disabled={loading}>
                    <InputLabel id="client-label">Klient</InputLabel>
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
                <FormControl fullWidth error={!!errors.collabolators} disabled={loading}>
                    <InputLabel id="collabolators-label">Współpracownicy</InputLabel>
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

                <Box display="flex" justifyContent="space-between" gap={2} alignItems="stretch">
                    {loading ? (
                        <CircularProgress size={24}/>
                    ) : (
                        <>
                            <Box flex={1}>
                                <DeleteProject projectId={projectId}/>
                            </Box>
                            <Box flex={1}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={loading}
                                    fullWidth
                                >
                                    Zapisz zmiany
                                </Button>
                            </Box>
                            <Box flex={1}>
                                <Button
                                    onClick={finishEditing}
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                >
                                    Anuluj
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default EditProject;