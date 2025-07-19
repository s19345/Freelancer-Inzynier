import React, { useEffect, useState } from 'react';
import {useParams, Link} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import { PROJECT_BACKEND_URL } from '../../settings';
import { useNavigate } from 'react-router';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';

const EditTask = () => {
    const { taskId } = useParams();
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();

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
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

            navigate(`/task/${taskId}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

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
            <Typography variant="h5">Edytuj zadanie</Typography>

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
                InputLabelProps={{ shrink: true }}
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

            <Button type="submit" variant="contained" color="primary" disabled={loading}>
                Zapisz zmiany
            </Button>
        </Box>
    );
};

export default EditTask;
