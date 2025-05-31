import React from "react";
import { useSelector } from "react-redux";
import { PROJECT_BACKEND_URL } from "../../settings";

const DeleteProject = ({ projectId, onDeleted }) => {
  const token = useSelector((state) => state.auth.token);

  const handleDelete = async () => {
    const confirmed = window.confirm("Czy na pewno chcesz usun�� ten projekt?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      if (response.ok) {
        alert("Projekt zosta� usuni�ty");
        if (onDeleted) onDeleted(); // np. od�wie�enie listy
      } else {
        const errorData = await response.json();
        console.error("B��d podczas usuwania projektu:", errorData);
        alert("Nie uda�o si� usun�� projektu");
      }
    } catch (error) {
      console.error("B��d sieci:", error);
      alert("Wyst�pi� b��d sieci podczas usuwania");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-800 font-medium"
    >
      Usu� projekt
    </button>
  );
};

export default DeleteProject;
