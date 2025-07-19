import React from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";

const DeleteProject = ({projectId}) => {
    const token = useAuthStore(state => state.token);

    const handleDelete = async () => {

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${token}`,
                },
            });

            if (response.ok) {
                console.log("Projekt został usunięty");
            } else {
                const errorData = await response.json();
                console.error("Błąd podczas usuwania projektu:", errorData);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
        }
    };

    return (
        <button
            onClick={handleDelete}
        >
            Usuń projekt
        </button>
    );
};

export default DeleteProject;
