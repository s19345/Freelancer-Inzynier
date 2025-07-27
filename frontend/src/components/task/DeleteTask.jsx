import React from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {Button} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteTask = ({taskId, onDeleteSuccess}) => {
    const token = useAuthStore((state) => state.token);

    const handleDelete = async () => {
        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                if (onDeleteSuccess) onDeleteSuccess();
            } else {
                const errorData = await response.json();
                console.error("Błąd podczas usuwania zadania:", errorData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    };

    return (
        <Button
            onClick={handleDelete}
            variant="outlined"
            color="error"
            size="small"
            startIcon={<DeleteIcon/>}
        >
            Usuń
        </Button>
    );
};

export default DeleteTask;
