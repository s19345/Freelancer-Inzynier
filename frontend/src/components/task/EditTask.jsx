import React, {useState} from 'react';
import {useParams} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import useGlobalStore from "../../zustand_store/globalInfoStore";
import TaskForm from "./TaskForm";

const EditTask = ({handleTaskUpdate, setIsEditing, task}) => {
    const {taskId} = useParams();
    const token = useAuthStore(state => state.token);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        status: task?.status || 'to_do',
        due_date: task?.due_date || '',
        project_version: task?.project_version || '',
        priority: task?.priority || 'medium',
        user_id: task?.user?.id || '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Błąd podczas aktualizacji zadania');
            }
            const data = await res.json();
            setMessage('Zadanie zostało zaktualizowane pomyślnie');
            setType('success');
            handleTaskUpdate(await res.json());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);


        }

    };

    if (error) return;

    return (
        <TaskForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            loading={loading}
            setIsEditing={setIsEditing}
            submitMessage={"Zapisz zmiany"}
        />
    );
};

export default EditTask;
