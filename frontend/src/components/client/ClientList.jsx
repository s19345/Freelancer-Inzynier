import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {Link, Link as RouterLink} from "react-router";
import {
    Box,
    CircularProgress,
    Typography,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Alert,
    Stack
} from "@mui/material";
import AutoDismissAlert from "../common/AutoDismissAlert";
import paths from "../../paths";

const ClientList = () => {
    const token = useAuthStore(state => state.token);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}clients/`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Nie udało się pobrać klientów");
                }

                const data = await res.json();
                setClients(data.results);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [token]);

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

    return (
        <Box mt={4}>
            <Typography variant="h5" gutterBottom>
                Lista klientów
            </Typography>

            {clients.length === 0 ? (
                <Typography variant="body1">Brak klientów do wyświetlenia.</Typography>
            ) : (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Nazwa firmy</strong></TableCell>
                            <TableCell><strong>Osoba kontaktowa</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Akcje</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {clients.map(client => (
                            <TableRow key={client.id}>
                                <TableCell>{client.company_name}</TableCell>
                                <TableCell>{client.contact_person}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            component={RouterLink}
                                            to={`/client/${client.id}`}
                                            variant="outlined"
                                            size="small"
                                        >
                                            Szczegóły
                                        </Button>
                                        <Button
                                            component={RouterLink}
                                            to={`/client/${client.id}/edit`}
                                            variant="contained"
                                            size="small"
                                        >
                                            Edytuj
                                        </Button>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
            <Box mt={2}>
                <Button
                    component={Link}
                    to={paths.createClient}
                    variant="contained"
                    color="primary"
                >
                    Dodaj Klienta
                </Button>
            </Box>
            <AutoDismissAlert/>
        </Box>
    );
};

export default ClientList;
