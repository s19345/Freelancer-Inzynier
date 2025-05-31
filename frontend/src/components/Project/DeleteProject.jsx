import React from "react";
import { useSelector } from "react-redux";
import { PROJECT_BACKEND_URL } from "../../settings";

const DeleteProject = ({ projectId, onDeleted }) => {
  const token = useSelector((state) => state.auth.token);

  const handleDelete = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usun±æ ten projekt?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        alert("Projekt zosta³ usuniêty");
        if (onDeleted) onDeleted(); // np. od¶wie¿enie listy
      } else {
        const errorData = await response.json();
        console.error("B³±d podczas usuwania projektu:", errorData);
        alert("Nie uda³o siê usun±æ projektu");
      }
    } catch (error) {
      console.error("B³±d sieci:", error);
      alert("Wyst±pi³ b³±d sieci podczas usuwania");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Usuñ projekt
    </button>
  );
};

export default DeleteProject;
