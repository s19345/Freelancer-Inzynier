import React from "react";
import useAuthStore from "../../zustand_store/authStore";
import { PROJECT_BACKEND_URL } from "../../settings";

const DeleteClient = ({ clientId }) => {
  const token = useAuthStore((state) => state.token);

  const handleDelete = async () => {

    try {
      const response = await fetch(`${PROJECT_BACKEND_URL}clients/${clientId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
      } else {
        const errorData = await response.json();
        console.error("Błąd podczas usuwania klienta:", errorData);
      }
    } catch (error) {
      console.error("Błąd sieci:", error);
    }
  };

  return (
    <button
      onClick={handleDelete}
    >
      Usuń
    </button>
  );
};

export default DeleteClient;
