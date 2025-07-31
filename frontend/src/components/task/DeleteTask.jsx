import React from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DeleteTask = ({taskId, handleDeleteSuccess}) => {
    const token = useAuthStore((state) => state.token);

    const handleDelete = async (e) => {

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                if (handleDeleteSuccess) handleDeleteSuccess(taskId);
            } else {
                const errorData = await response.json();
                console.error("Błąd podczas usuwania zadania:", errorData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    };

    return (

        <DeleteOutlineIcon
            fontSize="large"
            color="error"
            onClick={(e) => {
                e.stopPropagation();
                handleDelete(taskId);
            }}
        />
    );

};

export default DeleteTask;
