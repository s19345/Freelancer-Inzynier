import {
    Alert,
    Box,
    Card,
    MenuItem,
    TextField,
    Typography
} from "@mui/material";
import SubmitButton from "../common/SubmitButton";
import StdButton from "../common/StdButton";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {USERS_LIST_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";

const TaskForm = ({
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
    const user = useAuthStore((state) => state.user);

    const [friends, setFriends] = useState([]);
    const [friendsFetchingError, setFriendsFetchingError] = useState(null);
    const params = useMemo(() => new URLSearchParams({page_size: 10000}), []);
    const invalidText = "To pole jest wymagane";

    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = "Tytu³ jest wymagany";
        if (!formData.due_date) newErrors.due_date = "Termin wykonania jest wymagany";
        if (!formData.priority) newErrors.priority = "Priorytet jest wymagany";
        if (!formData.description.trim()) newErrors.description = "Opis jest wymagany";
        return newErrors;
    };

    const fetchFriends = useCallback(async () => {
        try {
            const res = await fetch(`${USERS_LIST_URL}friends/?${params}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                },
            });

            if (!res.ok) throw new Error("Nie uda³o siê pobraæ znajomych");
            const data = await res.json();

            const currentUser = {
                id: user.id,
                profile_picture: user.profile_picture || null,
                username: user.username,
            };
            const filteredFriends = data.results.filter((friend) => friend.id !== user.id);
            setFriends([currentUser, ...filteredFriends]);
        } catch (err) {
            setFriendsFetchingError(err.message);
        } finally {
        }

    }, [params, token, user.id, user.profile_picture, user.username]);

    useEffect(() => {
            fetchFriends();
        }, [fetchFriends]
    );

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
        if (setIsEditing) setIsEditing(false);
    }

    const handleOnClick = () => {
        if (setIsEditing) setIsEditing(false);
    }


    return (
        <Box sx={{mx: "auto", mt: 4}}>
            {friendsFetchingError && (
                <Alert severity="error">B³±d pobierania znajomych: {friendsFetchingError}</Alert>
            )}

            <Box component="form" onSubmit={handleLocalSubmit} sx={{display: "flex", flexDirection: "column", gap: 2}}>
                <Card
                    sx={{
                        p: 2
                    }}
                >
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, alignItems: "space-between"}}>
                        <Box sx={{display: "flex", flexDirection: "column", flex: 4}}>
                            <Typography variant="h6" sx={{ml: 1}}>Nazwa</Typography>
                            <TextField
                                onInvalid={(e) => e.target.setCustomValidity(invalidText)}
                                onInput={(e) => e.target.setCustomValidity("")}
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                error={!!errors.title}
                                helperText={errors.title}
                                disabled={loading}
                            />
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", flex: 1}}>
                            <Typography variant="h6" sx={{ml: 1}}>Termin wykonania</Typography>
                            <TextField
                                onInvalid={(e) => e.target.setCustomValidity(invalidText)}
                                onInput={(e) => e.target.setCustomValidity("")}
                                required
                                name="due_date"
                                type="date"
                                value={formData.due_date}
                                onChange={handleChange}
                                error={!!errors.due_date}
                                helperText={errors.due_date}
                                InputLabelProps={{shrink: true}}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, mt: 3, width: "100%"}}>
                        <Box sx={{display: "flex", flexDirection: "column", width: "100%"}}>
                            <Typography variant="h6" sx={{ml: 1}}>Opis</Typography>
                            <TextField
                                onInvalid={(e) => e.target.setCustomValidity(invalidText)}
                                onInput={(e) => e.target.setCustomValidity("")}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                multiline
                                rows={2}
                                disabled={loading}
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "row", gap: 1, width: "100%", mt: 3}}>
                        <Box sx={{display: "flex", flexDirection: "column", flex: 1}}>
                            <Typography variant="h6" sx={{ml: 1}}>Przypisz do</Typography>
                            <TextField
                                select
                                name="user_id"
                                value={formData.user_id}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="">? Brak ?</MenuItem>
                                {friends.map(user => (
                                    <MenuItem key={user.id} value={user.id}>
                                        {user.username}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                        <Box sx={{display: "flex", flexDirection: "column", flex: 1}}>
                            <Typography variant="h6" sx={{ml: 1}}>Priorytet</Typography>
                            <TextField
                                onInvalid={(e) => e.target.setCustomValidity(invalidText)}
                                onInput={(e) => e.target.setCustomValidity("")}
                                required
                                select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                fullWidth
                            >
                                <MenuItem value="low">Niski</MenuItem>
                                <MenuItem value="medium">¦redni</MenuItem>
                                <MenuItem value="high">Wysoki</MenuItem>
                            </TextField>
                        </Box>
                    </Box>
                </Card>
                <Box sx={{display: "flex", flexDirection: "row", gap: 5, mt: 2, mr: 10, justifyContent: "flex-end"}}>
                    <SubmitButton type={"submit"} label={submitMessage}/>
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

export default TaskForm;