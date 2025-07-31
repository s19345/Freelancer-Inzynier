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
} from "@mui/material";
import useGlobalStore from "../../zustand_store/globalInfoStore";
import {useNavigate} from "react-router";
import paths from "../../paths";
import DeleteButton from "../common/DeleteButton";

const DeleteProject = ({projectId}) => {
    const token = useAuthStore(state => state.token);
    const [open, setOpen] = useState(false);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);
    const navigate = useNavigate()


    const handleDelete = async () => {
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`
                }
            });

            if (response.ok) {
                setMessage("Projekt został pomyślnie usunięty.");
                setType("success");
                navigate(paths.projectList)
            } else {
                const errorData = await response.json();
                setMessage(errorData.detail || "Nie udało się usunąć projektu.");
                setType("error");
            }
        } catch (error) {
            setMessage("Wystąpił błąd podczas usuwania projektu.");
            setType("error");
        } finally {
            setOpen(false);
        }
    };

    return (
        <>
            <DeleteButton handleDelete={() => setOpen(true)}/>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Potwierdzenie usunięcia</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Czy na pewno chcesz usunąć ten projekt? Tej operacji nie można cofnąć.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{justifyContent: "space-around"}}>
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