import React, {useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {useParams} from "react-router";
import {PROJECT_BACKEND_URL,} from "../../settings";
import {
    CircularProgress
} from "@mui/material";
import useGlobalStore from "../../zustand_store/globalInfoStore";
import ProjectForm from "./ProjectForm";
import paths from "../../paths";

const EditProject = ({setIsEditing, handleUpdate, project}) => {
    const {projectId} = useParams();
    const token = useAuthStore((state) => state.token);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "",
        budget: project.budget || "",
        client: project.client?.id || "",  // todo czy tu powinno być id czy cały klient
        collabolators: project.collabolators?.map(c => c.id) || [] // todo czy tu powinno być id czy cali współpracownicy
    });

    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {

        try {
            const response = await fetch(`${PROJECT_BACKEND_URL}projects/${projectId}/`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || "Błąd aktualizacji projektu");
            }

            const data = await response.json();
            console.log("Updated project data:", data);
            setMessage("Projekt został zaktualizowany pomyślnie");
            setType("success");
            handleUpdate(data);

        } catch (err) {
            setMessage(err.message);
            setType("error");
        } finally {
            setLoading(false);
            setIsEditing(false);
        }
    };

    if (loading) return <CircularProgress/>;

    return (

        <ProjectForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            returnPath={paths.project(projectId)}
            setIsEditing={setIsEditing}
            submitMessage={"Zapisz zmiany"}
        />
    );
};

export default EditProject;