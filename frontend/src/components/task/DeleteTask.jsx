import React from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import DeleteButton from "../common/DeleteButton";
import useGlobalStore from "../../zustand_store/globalInfoStore";

const DeleteTask = ({taskId, handleDeleteSuccess, contextText}) => {
    const token = useAuthStore((state) => state.token);
    const setMessage = useGlobalStore.getState().setMessage;
    const setType = useGlobalStore.getState().setType;

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
                setMessage(`${contextText} zostało pomyślnie usunięte.`);
                setType("success");
            } else {
                const errorData = await response.json();
                console.error(`Błąd podczas usuwania ${contextText}:`, errorData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    };

    return (
        <DeleteButton handleDelete={handleDelete}/>
    );
};

export default DeleteTask;