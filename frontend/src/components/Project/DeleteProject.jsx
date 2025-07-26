import React, {useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert
} from "@mui/material";

const DeleteProject = ({projectId}) => {
    const token = useAuthStore(state => state.token);
    const [open, setOpen] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                setStatusMessage("Projekt został usunięty.");

            } else {
                const errorData = await response.json();
                setStatusMessage(`Błąd: ${errorData.detail || "Nie udało się usunąć projektu."}`);
            }
        } catch (error) {
            setStatusMessage("Błąd sieci: " + error.message);
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            {statusMessage && (
                <Alert severity={statusMessage.startsWith("Błąd") ? "error" : "success"}>
                    {statusMessage}
                </Alert>
            )}

            <Button variant="outlined" color="error" onClick={() => setOpen(true)}>
                Usuń projekt
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć ten projekt? Tej operacji nie można cofnąć.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Anuluj</Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Usuń
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteProject;