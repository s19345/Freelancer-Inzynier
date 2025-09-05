import React, {useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useNavigate} from 'react-router'
import {PROJECT_BACKEND_URL} from "../../settings";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import paths from "../../paths";
import DeleteButton from "../common/DeleteButton";
import useGlobalStore from "../../zustand_store/globalInfoStore";

const DeleteClient = ({clientId}) => {
    const setMessage = useGlobalStore.getState().setMessage;
    const setType = useGlobalStore.getState().setType;
    const token = useAuthStore((state) => state.token);
    const [open, setOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();

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
                setMessage("Klient został pomyślnie usunięty.");
                setType("success");
                setOpen(false);
                navigate(paths.clients)
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
    const handleDeleteClick = () => {
        setOpen(true);
    }

    return (
        <>
            <DeleteButton handleDelete={handleDeleteClick}/>

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
