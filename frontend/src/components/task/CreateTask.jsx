import React, {useState} from "react";
import {Box} from '@mui/material';
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {useParams, useNavigate} from "react-router";
import useGlobalStore from '../../zustand_store/globalInfoStore';
import paths from "../../paths";
import TaskForm from "./TaskForm";

const CreateTaskForm = ({projectId: propProjectId}) => {
    const {projectId: paramProjectId, taskId: paramTaskId} = useParams();
    const projectId = propProjectId || paramProjectId;
    const parentTaskId = paramTaskId || null;
    const navigate = useNavigate();
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "to_do",
        due_date: "",
        priority: "medium",
        user: "",
        parent_task: "",
    });

    const token = useAuthStore(state => state.token);
    const returnUrl = parentTaskId ? paths.taskDetails(projectId, parentTaskId) : paths.project(projectId)
    const contextText = parentTaskId ? "podzadanie" : "zadanie";
    const successMessage = parentTaskId ? "Podzadanie zostało utworzone" : "Zadanie zostało utworzone";


    const handleSubmit = async () => {

        const payload = {
            title: formData.title,
            description: formData.description,
            status: formData.status,
            due_date: formData.due_date,
            project_version: formData.project_version,
            priority: formData.priority,
            project_id: parseInt(projectId),
            user_id: formData.user_id || null,
        };

        if (parentTaskId) {
            payload.parent_task_id = parentTaskId;
        }


        try {
            console.log("Tworzenie zadania:", payload);
            const response = await fetch(`${PROJECT_BACKEND_URL}task/?project=${projectId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(successMessage, "zrobione");
                setType("success")
                navigate(returnUrl)
            } else {

                const errorMessage = typeof data === "object"
                    ? Object.values(data).flat().join(" ")
                    : "Wystąpił błąd podczas tworzenia zadania";
                console.error(errorMessage);
            }
        } catch (error) {
            console.error("Błąd sieci:", error);
            console.error("Błąd połączenia z serwerem");
        }
    };

    return (
        <Box>
            <TaskForm
                formData={formData}
                setFormData={setFormData}
                submitMessage={`utwórz ${contextText}`}
                returnPath={returnUrl}
                handleSubmit={handleSubmit}
            />
        </Box>
    );
};

export default CreateTaskForm;
