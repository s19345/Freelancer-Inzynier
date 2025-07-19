import React, {useEffect, useState} from 'react';
import {useParams, Link as RouterLink} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Button,
    Stack
} from '@mui/material';

const ClientDetails = () => {
    const {clientId} = useParams();
    const token = useAuthStore(state => state.token);

    const [client, setClient] = useState(null);
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

                if (!res.ok) {
                    throw new Error('Nie udało się pobrać danych klienta');
                }

                const data = await res.json();
                setClient(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [clientId, token]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" mt={4}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{mt: 3}}>
                Błąd: {error}
            </Alert>
        );
    }

    if (!client) {
        return (
            <Alert severity="warning" sx={{mt: 3}}>
                Nie znaleziono klienta.
            </Alert>
        );
    }

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Szczegóły klienta
            </Typography>

            <Stack spacing={1} mb={3}>
                <Typography><strong>Nazwa firmy:</strong> {client.company_name}</Typography>
                <Typography><strong>Osoba kontaktowa:</strong> {client.contact_person}</Typography>
                <Typography><strong>Email:</strong> {client.email}</Typography>
                <Typography><strong>Telefon:</strong> {client.phone || 'Brak danych'}</Typography>
                {/* moge dodać tu pozniej więcej pól*/}
            </Stack>

            <Button
                variant="outlined"
                component={RouterLink}
                to="/clients"
            >
                &larr; Powrót do listy klientów
            </Button>
        </Box>
    );
};

export default ClientDetails;
