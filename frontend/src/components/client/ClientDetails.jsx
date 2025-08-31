import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Stack
} from '@mui/material';
import paths from "../../paths";
import DeleteClient from "./DeleteClient";
import EditButton from "../common/EditButton";
import ReturnButton from "../common/ReturnButton";

const ClientDetails = () => {
    const {clientId} = useParams();
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();

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

    const handleEdit = () => {
        navigate(paths.editClient(clientId));
    }

    return (
        <Box mt={4}>
            <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
                <Typography variant="h5" gutterBottom>
                    Szczegóły klienta
                </Typography>
                <Box sx={{ml: 2}}>
                    <EditButton handleEdit={handleEdit}/>
                </Box>
                <DeleteClient clientId={clientId}/>
            </Box>
            <Stack spacing={1} mb={3}>
                <Typography><strong>Nazwa firmy:</strong> {client.company_name}</Typography>
                <Typography><strong>Branża:</strong> {client.industry}</Typography>
                <Typography><strong>Osoba kontaktowa:</strong> {client.contact_person}</Typography>
                <Typography><strong>Email:</strong> {client.email}</Typography>
                <Typography><strong>Telefon:</strong> {client.phone || 'Brak danych'}</Typography>
                <Typography><strong>Notatki:</strong> {client.notes || 'Brak danych'}</Typography>
            </Stack>
            <ReturnButton label="Powrót do listy klientów" to={paths.clients}/>

        </Box>
    );
};

export default ClientDetails;
