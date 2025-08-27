import {
    Alert,
    Box,
    Card, Chip,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import SubmitButton from "../common/SubmitButton";
import StdButton from "../common/StdButton";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {PROJECT_BACKEND_URL, USERS_LIST_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";

const ProjectForm = ({
                         handleSubmit,
                         returnPath,
                         formData,
                         setFormData,
                         loading,
                         setIsEditing,
                         submitMessage
                     }) => {
    const token = useAuthStore((state) => state.token);
    const [errors, setErrors] = useState({});

    const [clients, setClients] = useState([]);
    const [clientsFetchingError, setClientsFetchingError] = useState(null);

    const [friends, setFriends] = useState([]);
    const [friendsFetchingError, setFriendsFetchingError] = useState(null);
    const params = useMemo(() => new URLSearchParams({page_size: 10000}), []);

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Nazwa projektu jest wymagana";
        if (!formData.description.trim()) newErrors.description = "Opis projektu jest wymagany";
        if (!formData.status) newErrors.status = "Status projektu jest wymagany";
        if (!formData.budget) newErrors.budget = "Budżet projektu jest wymagany";
        else if (formData.budget && Number(formData.budget) < 0)
            newErrors.budget = "Budżet nie może być ujemny";
        return newErrors;
    };

    const fetchClients = useCallback(async () => {
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
        }
    }, [token, params]);

    const fetchFriends = useCallback(async () => {
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
        }
    }, [token, params]);

    useEffect(() => {
        fetchClients();
        fetchFriends();
    }, [fetchClients, fetchFriends]);
    const handleChange = (e) => {
        const {name, value} = e.target;

        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleLocalSubmit = (e) => {
        e.preventDefault()
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        handleSubmit();
    }

    const handleOnClick = () => {
        if (setIsEditing) setIsEditing(false);
        setErrors({});
    }

    return (
        <Box sx={{mx: "auto", mt: 4}}>
            {clientsFetchingError && (
                <Alert severity="error">Błąd pobierania klientów: {clientsFetchingError}</Alert>
            )}
            {friendsFetchingError && (
                <Alert severity="error">Błąd pobierania znajomych: {friendsFetchingError}</Alert>
            )}

            <Box component="form" onSubmit={handleLocalSubmit} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Card sx={{p: 2}}>
                    <Box sx={{display: "flex", flexDirection: "column"}}>
                        <Typography variant="h6" sx={{ml: 1}}>Nazwa projektu</Typography>
                        <TextField
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            disabled={loading}
                        />
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", mt: 3}}>
                        <Typography variant="h6" sx={{ml: 1}}>Opis</Typography>
                        <TextField
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            error={!!errors.description}
                            helperText={errors.description}
                            multiline
                            minRows={2}
                            disabled={loading}
                        />
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, mt: 3}}>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Status</Typography>
                            <FormControl
                                fullWidth
                                error={!!errors.status}
                                disabled={loading}
                                sx={{minWidth: 200}}
                            >
                                <Select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="">-- Wybierz status --</MenuItem>
                                    <MenuItem value="active">Aktywny</MenuItem>
                                    <MenuItem value="completed">Ukończony</MenuItem>
                                    <MenuItem value="paused">Wstrzymany</MenuItem>
                                </Select>
                                {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
                            </FormControl>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Budżet</Typography>
                            <TextField
                                name="budget"
                                type="number"
                                value={formData.budget}
                                onChange={handleChange}
                                error={!!errors.budget}
                                helperText={errors.budget}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Klient</Typography>
                            <FormControl
                                fullWidth
                                error={!!errors.client}
                                disabled={loading}
                                sx={{minWidth: 200}}
                            >
                                <Select
                                    name="client"
                                    value={formData.client}
                                    onChange={handleChange}
                                >
                                    {clients.length > 0 ? (
                                        clients.map((client) => (
                                            <MenuItem key={client.id} value={client.id}>
                                                {client.company_name} - {client.contact_person}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            Nie znaleziono żadnych klientów
                                        </MenuItem>
                                    )}
                                </Select>
                                {errors.client && <FormHelperText>{errors.client}</FormHelperText>}
                            </FormControl>
                        </Box>


                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, mt: 3}}>
                        <Box sx={{display: "flex", flexDirection: "column", minWidth: 250}}>
                            <Typography variant="h6" sx={{ml: 1}}>Współpracownicy</Typography>
                            <FormControl fullWidth error={!!errors.collabolators} disabled={loading}>
                                <Select
                                    name="collabolators"
                                    multiple
                                    value={formData.collabolators}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            collabolators: e.target.value,
                                        }))
                                    }
                                    renderValue={(selected) => {
                                        const selectedFriends = friends.filter((f) => selected.includes(f.id));
                                        const visible = selectedFriends.slice(0, 3); // pokaż max 3
                                        const hiddenCount = selectedFriends.length - visible.length;

                                        return (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {visible.map((f) => (
                                                    <Chip key={f.id} label={f.username} size="small"/>
                                                ))}
                                                {hiddenCount > 0 && (
                                                    <Typography variant="body2" sx={{ml: 0.5}}>
                                                        +{hiddenCount}
                                                    </Typography>
                                                )}
                                            </Box>
                                        );
                                    }}
                                >
                                    {friends.length > 0 ? (
                                        friends.map((friend) => (
                                            <MenuItem key={friend.id} value={friend.id}>
                                                {friend.username}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>
                                            Nie znaleziono żadnych znajomych
                                        </MenuItem>
                                    )}
                                </Select>
                                {errors.collabolators && (
                                    <FormHelperText>{errors.collabolators}</FormHelperText>
                                )}
                            </FormControl>
                        </Box>
                    </Box>
                </Card>
                <Box sx={{display: "flex", flexDirection: "row", gap: 5, mt: 2, mr: 10, justifyContent: "flex-end"}}>
                    <SubmitButton type={"submit"} label={submitMessage} to={returnPath}/>
                    <StdButton
                        label="Anuluj"
                        to={returnPath}
                        onClick={() => handleOnClick()}

                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ProjectForm;