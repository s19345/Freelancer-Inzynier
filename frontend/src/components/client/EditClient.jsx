import React, {useEffect, useState} from 'react';
import {useParams, useNavigate, Link, Link as RouterLink} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import DeleteClient from './DeleteClient';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Stack,
} from '@mui/material';
import paths from "../../paths";
import useGlobalStore from "../../zustand_store/globalInfoStore";

const EditClient = () => {
    const {clientId} = useParams();
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);

    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClient = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}clients/${clientId}/`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Nie udało się pobrać danych klienta');

                const data = await res.json();
                setFormData({
                    company_name: data.company_name || '',
                    contact_person: data.contact_person || '',
                    email: data.email || '',
                    phone: data.phone || '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [clientId, token]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`${PROJECT_BACKEND_URL}clients/${clientId}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.detail || 'Błąd podczas aktualizacji klienta');
            }
            setMessage("Dane klienta zostały zaktualizowane")
            setType("success")
            navigate(paths.client(clientId));
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading)
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );

    return (
        <Box mt={4} maxWidth={600} mx="auto">
            <Typography variant="h5" mb={3}>
                Edytuj klienta
            </Typography>
            {error && (
                <Alert severity="error" sx={{mb: 2}}>
                    Błąd: {error}
                </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
                <Stack spacing={3}>
                    <TextField
                        label="Nazwa firmy"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Osoba kontaktowa"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        fullWidth
                    />

                    <TextField
                        label="Telefon"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        fullWidth
                    />

                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            size="large"
                        >
                            Zapisz zmiany
                        </Button>
                        <Button
                            component={Link}
                            to={paths.clients}
                            variant="outlined"
                            color="secondary"
                        >
                            Anuluj
                        </Button>


                    </Box>
                </Stack>
            </Box>
        </Box>
    );
};

export default EditClient;
