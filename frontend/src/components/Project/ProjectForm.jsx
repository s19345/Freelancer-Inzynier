import {
    Alert,
    Box,
    Card,
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
        if (!formData.status) newErrors.status = "Status projektu jest wymagany";
        if (formData.budget && Number(formData.budget) < 0)
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
                <Card
                    sx={{
                        p: 2
                    }}
                >
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1}}>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Nazwa projektu</Typography>
                            <TextField
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                error={!!errors.name}
                                helperText={errors.name}
                                disabled={loading}
                            />
                        </Box>
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
                                    required
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
                                required
                                value={formData.budget}
                                onChange={handleChange}
                                error={!!errors.budget}
                                helperText={errors.budget}
                                disabled={loading}
                            />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, mt: 3}}>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Opis</Typography>
                            <TextField
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={2}
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
                                    {clients.map((client) => (
                                        <MenuItem key={client.id} value={client.id}>
                                            {client.company_name} - {client.contact_person}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.client && <FormHelperText>{errors.client}</FormHelperText>}
                            </FormControl>
                        </Box>


                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, maxWidth: "200px", mt: 3}}>
                        <Box sx={{display: "flex", flexDirection: "column"}}>
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
                        </Box>
                    </Box>
                </Card>
                <Box sx={{display: "flex", flexDirection: "row", gap: 5, mt: 2, mr: 10, justifyContent: "flex-end"}}>
                    <SubmitButton type={"submit"} label={submitMessage} to={returnPath}/>
                    <StdButton
                        label={"Anuluj"}
                        to={returnPath}
                        onClick={() => handleOnClick()}

                    />
                </Box>
            </Box>
        </Box>
    )
}

export default ProjectForm;