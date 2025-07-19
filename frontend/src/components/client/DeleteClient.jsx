import React, {useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";

const DeleteClient = ({clientId}) => {
    const token = useAuthStore((state) => state.token);
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}clients/${clientId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                setOpen(false);
            } else {
                const errorData = await response.json();
                console.error("Błąd podczas usuwania klienta:", errorData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(true)}
                disabled={deleting}
            >
                Usuń
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć tego klienta? Operacja jest nieodwracalna
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={deleting}>
                        Anuluj
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="error"
                        variant="contained"
                        disabled={deleting}
                    >
                        {deleting ? "Usuwanie..." : "Usuń"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteClient;
