import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import {
    Box,
    TextField,
    Button,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import useGlobalStore from "../../zustand_store/globalInfoStore";

const EditTask = ({finishEditing, handleTaskUpdate}) => {
        const {taskId, projectId} = useParams();
        const token = useAuthStore(state => state.token);
        const setMessage = useGlobalStore((state) => state.setMessage);
        const setType = useGlobalStore((state) => state.setType);

        const [formData, setFormData] = useState({
            title: '',
            description: '',
            status: 'to_do',
            due_date: '',
            project_version: '',
            priority: 'medium',
        });

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        useEffect(() => {
            const fetchTask = async () => {
                try {
                    const res = await fetch(`${PROJECT_BACKEND_URL}tasks/${taskId}/`, {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Token ${token}`,
                        },
                    });

                    if (!res.ok) throw new Error('Nie udało się pobrać danych zadania');

                    const data = await res.json();
                    setFormData({
                        title: data.title || '',
                        description: data.description || '',
                        status: data.status || 'to_do',
                        due_date: data.due_date || '',
                        project_version: data.project_version || '',
                        priority: data.priority || 'medium',
                    });
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchTask();
        }, [taskId, token]);

        const handleChange = (e) => {
            const {name, value} = e.target;
            setFormData(prev => ({...prev, [name]: value}));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
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
                setMessage('Zadanie zostało zaktualizowane pomyślnie');
                setType('success');
                handleTaskUpdate(await res.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                finishEditing();

            }


        };

        if (error) return;

        return (
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 500,
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 4
                }}
            >

                <TextField
                    label="Tytuł"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Opis"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <TextField
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    select
                    fullWidth
                >
                    <MenuItem value="to_do">Do zrobienia</MenuItem>
                    <MenuItem value="in_progress">W trakcie</MenuItem>
                    <MenuItem value="completed">Zakończone</MenuItem>
                </TextField>

                <TextField
                    label="Termin"
                    name="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={handleChange}
                    InputLabelProps={{shrink: true}}
                    required
                    fullWidth
                />

                <TextField
                    label="Wersja projektu"
                    name="project_version"
                    value={formData.project_version}
                    onChange={handleChange}
                    required
                    fullWidth
                />

                <TextField
                    label="Priorytet"
                    name="priority"
                    value={formData.priority}
                    onChange={handleChange}
                    select
                    fullWidth
                >
                    <MenuItem value="low">Niski</MenuItem>
                    <MenuItem value="medium">Średni</MenuItem>
                    <MenuItem value="high">Wysoki</MenuItem>
                </TextField>

                <Box display="flex" justifyContent="flex-end" gap={2}>
                    {loading ? <CircularProgress size={24}/> :
                        <Button type="submit" variant="contained" color="primary" disabled={loading}>
                            Zapisz zmiany
                        </Button>
                    }
                    <Button
                        onClick={finishEditing}
                        variant="outlined"
                        color="secondary"
                    >
                        Anuluj
                    </Button>
                </Box>
                {error && <Alert severity="error">{error}</Alert>}
            </Box>
        );
    }
;

export default EditTask;