import React, {useEffect, useRef, useState} from 'react';
import {
    Box,

    Grid,
    Typography,
    Paper, Stack, Popover, DialogTitle, Dialog, DialogContent, TextField, DialogActions, Button
} from '@mui/material';
import {USERS_LIST_URL} from '../../settings';
import {useParams} from "react-router";
import useAuthStore from "../../zustand_store/authStore";
import {updateOrCreateNotes} from "../helpers";
import CollaborationHistory from "./CollaborationHistory";

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
                        {displayText || `Dodaj ${label}`}
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

                console.log(`Zapisano ${field}:`, inputValue);
                setOpen(false);
            } catch (error) {
                console.error("B³±d przy zapisie notatki:", error);
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
                            {field === "notes" ? "Edytuj notatkê" : "Edytuj ocenê"}
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label={field === "notes" ? "Wpisz notatkê" : "Podaj ocenê"}
                                type="text"
                                fullWidth
                                variant="outlined"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
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
    }
;

export default function FriendDetails() {
    const [friend, setFriend] = useState()
    const {friendId} = useParams();
    const token = useAuthStore((state) => state.token);


    useEffect(() => {
        const fetchUserDetails = async (id) => {
            try {
                const response = await fetch(`${USERS_LIST_URL}friends/${id}/`, {
                    headers: {
                        Authorization: `Token ${token}`,
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user details');
                }
                const data = await response.json();
                setFriend(data);
            } catch (error) {
                console.error('Error fetching user details:', error);
            }

        }

        fetchUserDetails(friendId);
    }, []);

    return (
        <>
            <Paper elevation={3} sx={{p: 4, borderRadius: 4, maxWidth: 900, mx: 'auto'}}>
                {friend && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2">Imiê i Nazwisko</Typography>
                            <TextBox>{friend.first_name} {friend.last_name}</TextBox>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2">Email</Typography>
                            <TextBox>{friend.email}</TextBox>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2">Telefon</Typography>
                            <TextBox>{friend.phone_number}</TextBox>
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2">Lokalizacja / strefa czasowa</Typography>
                            <TextBox>{friend.location} / {friend.timezone}</TextBox>
                        </Grid>

                        <Grid>
                            <ExpandableText
                                label="umiejêtno¶ci"


                                text={
                                    friend.skills?.length
                                        ? friend.skills.map((s) => s.name).join(", ")
                                        : null
                                }
                            />
                        </Grid>
                        <Grid>
                            <ExpandableText
                                label="bio"
                                text={friend.bio}
                            />
                        </Grid>

                        <Grid item xs={12} sm={4}>
                            <Typography variant="subtitle2">Twoja ocena</Typography>
                            <TextBox
                                editable={true}
                                friendId={friend.id}
                                field="rate"
                                initialValue={friend.friend_notes ? friend.friend_notes.rate : ""}
                                setFriend={setFriend}
                            >
                                {friend.friend_notes ? `${friend.friend_notes.rate}` : "Kliknij aby dodaæ swoj± ocenê"}
                            </TextBox>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2">Notes</Typography>
                            <TextBox
                                editable={true}
                                friendId={friend.id}
                                field="notes"
                                initialValue={friend.friend_notes ? friend.friend_notes.notes : ""}
                                setFriend={setFriend}
                            >
                                {friend.friend_notes ? friend.friend_notes.notes : "Dodaj notatkê."}
                            </TextBox>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2">Projekty nad którymi
                                wspó³pracowali¶cie</Typography>
                            <TextBox>
                                {friend.project ? friend.project : "Jeszcze nie wspó³pracowali¶cie nad ¿adnym projektem."}
                            </TextBox>
                        </Grid>

                    </Grid>
                )}

            </Paper>
            {
                friend?.collaboration_history &&
                <CollaborationHistory history={friend.collaboration_history}/>
            }
        </>
    );
}