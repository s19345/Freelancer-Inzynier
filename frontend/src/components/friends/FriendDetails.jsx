import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
    Box,

    Grid,
    Typography,
    Paper, Stack, Popover, DialogTitle, Dialog, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import {USERS_LIST_URL} from '../../settings';
import {useParams} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import CollaborationHistory from "./CollaborationHistory";
import {updateOrCreateNotes} from "../fetchers";

const ExpandableText = ({label, icon, text}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const textRef = useRef(null);

    const handleOpen = () => setAnchorEl(textRef.current);
    const handleClose = () => setAnchorEl(null);
    const open = Boolean(anchorEl);

    const displayText = text?.length > 30 ? `${text.slice(0, 30)}...` : text;

    return (
        <>
            <Typography variant="subtitle2">{label}</Typography>
            <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                width="85%"
                sx={{cursor: "pointer", mt: 1}}
                onClick={handleOpen}
            >
                <TextBox>
                    <Typography
                        ref={textRef}
                        variant="body2"
                        color="#4b4b4b"
                        noWrap
                        align='center'
                        sx={{overflow: "hidden", textAlign: "center"}}
                    >
                        {displayText || `brak ${label}`}
                    </Typography>
                </TextBox>
            </Stack>

            <Popover
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: "bottom", horizontal: "left"}}
                transformOrigin={{vertical: "top", horizontal: "left"}}
                PaperProps={{sx: {maxWidth: 300, p: 2}}}
            >
                <Typography variant="body2">{text || `Brak ${label}`}</Typography>
            </Popover>
        </>
    );
};

const TextBox = ({
                     children,
                     sx,
                     editable = false,
                     friendId,
                     field = "notes",
                     initialValue = "",
                     setFriend
                 }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(initialValue);

    const handleOpen = () => {
        if (editable) setOpen(true);
    };
    const handleClose = () => setOpen(false);

    const handleSave = async () => {
        const notes = field === "notes" ? inputValue : null;
        const rate = field === "rate" ? inputValue : null;

        try {
            const updatedNotes = await updateOrCreateNotes(friendId, notes, rate);

            setFriend((prevFriend) => ({
                ...prevFriend,
                friend_notes: updatedNotes,
            }));
            setOpen(false);
        } catch (error) {
            console.error("Błąd przy zapisie notatki:", error);
        }
    };

    return (
        <>
            <Box
                sx={{
                    mt: 1,
                    color: "text.secondary",
                    border: "1px solid black",
                    p: 1,
                    borderRadius: 3,
                    cursor: editable ? "pointer" : "default",
                    textAlign: "center",
                    ...sx,
                }}
                onClick={handleOpen}
            >
                {children}
            </Box>

            {editable && (
                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>
                        {field === "notes" ? "Edytuj notatkę" : "Edytuj ocenę"}
                    </DialogTitle>
                    <DialogContent sx={{width: 500}}>
                        <TextField
                            autoFocus
                            margin="dense"
                            label={field === "notes" ? "Wpisz notatkę" : "Podaj ocenę"}
                            type="text"
                            fullWidth
                            multiline
                            variant="outlined"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            inputProps={field !== "notes" ? {maxLength: 20} : {}}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Anuluj</Button>
                        <Button onClick={handleSave} variant="contained">
                            Zapisz
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
};

export default function FriendDetails() {
    const [friend, setFriend] = useState()
    const {friendId} = useParams();
    const token = useAuthStore((state) => state.token);

    const fetchUserDetails = useCallback(async (id) => {
        try {
            const response = await fetch(`${USERS_LIST_URL}friends/${id}/`, {
                headers: {
                    Authorization: `Token ${token}`,
                }
            });
            if (!response.ok) {
                throw new Error('Nie udało się pobrać szczegółów znajomego');
            }
            const data = await response.json();
            setFriend(data);
        } catch (error) {
            console.error('Błąd podczas pobierania szczegółów znajomego:', error);
        }

    }, [token])

    useEffect(() => {
        fetchUserDetails(friendId);
    }, [fetchUserDetails, friendId]);

    return (
        <>
            <Paper elevation={3} sx={{p: 3, borderRadius: 4, maxWidth: 900, mx: 'auto'}}>
                {friend && (
                    <>
                        <Typography variant="h5" align={"center"} gutterBottom>{friend.username}</Typography>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">Imię i Nazwisko</Typography>
                                <TextBox>
                                    {friend.first_name || friend.last_name
                                        ? `${friend.first_name || ''} ${friend.last_name || ''}`.trim()
                                        : 'brak danych'}
                                </TextBox>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">Email</Typography>
                                <TextBox>{friend.email}</TextBox>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">Telefon</Typography>
                                <TextBox>
                                    {friend.phone_number ? friend.phone_number : 'brak danych'}
                                </TextBox>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">Lokalizacja / strefa czasowa</Typography>
                                <TextBox>
                                    {friend.location || friend.timezone
                                        ? `${friend.location || ''}${friend.location && friend.timezone ? ' / ' : ''}${friend.timezone || ''}`
                                        : 'brak danych'}
                                </TextBox>
                            </Grid>

                            <Grid>
                                <ExpandableText
                                    label="Umiejętności"

                                    text={
                                        friend.skills?.length
                                            ? friend.skills.map((s) => s.name).join(", ")
                                            : null
                                    }
                                />
                            </Grid>
                            <Grid>
                                <ExpandableText
                                    label="Bio"
                                    text={friend.bio}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Typography variant="subtitle2">Twoja ocena</Typography>
                                <TextBox
                                    editable={true}
                                    friendId={friend.id}
                                    field="rate"
                                    initialValue={friend.friend_notes?.rate ? friend.friend_notes.rate : ""}
                                    setFriend={setFriend}
                                >
                                    {friend.friend_notes?.rate ? `${friend.friend_notes.rate}` : "Kliknij aby dodać swoją ocenę"}
                                </TextBox>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2">Notatki</Typography>
                                <TextBox
                                    editable={true}
                                    friendId={friend.id}
                                    field="notes"
                                    initialValue={friend.friend_notes?.notes ? friend.friend_notes.notes : ""}
                                    setFriend={setFriend}
                                >
                                    {friend.friend_notes?.notes ? friend.friend_notes.notes : "Kliknij aby dodać notatkę."}
                                </TextBox>
                            </Grid>
                        </Grid>

                    </>
                )}
            </Paper>
            {friend?.collaboration_history &&
                <Box sx={{p: 3, borderRadius: 4, maxWidth: 900, mx: 'auto'}}>
                    <CollaborationHistory history={friend.collaboration_history}/>
                </Box>
            }
        </>
    );
}
