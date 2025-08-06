import React, {useCallback, useEffect, useState} from "react";
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
import paths from "../../paths";
import PaginationFrame from "../common/Pagination";

const ClientList = () => {
        const token = useAuthStore(state => state.token);
        const [clients, setClients] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [pagination, setPagination] = useState({next: null, prev: null, pages: 0, currentPage: 1});


        const fetchClients = useCallback(async (page) => {
            try {
                const res = await fetch(`${PROJECT_BACKEND_URL}clients/?page=${page || 1}`, {
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
                setPagination({
                    next: data.next,
                    prev: data.previous,
                    pages: data.total_pages,
                    currentPage: data.current_page
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }, [token])

        useEffect(() => {
            fetchClients();
        }, [fetchClients]);

        const handlePageChange = (page) => {
            setPagination((prev) => ({
                ...prev,
                currentPage: page,
            }));
            fetchClients(page);
        }

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
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
                <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                    m: 2
                }}>
                    <Box sx={{flex: 8}}>
                        {pagination.pages > 1 &&
                            <PaginationFrame pagination={pagination} handleChange={handlePageChange}/>
                        }
                    </Box>
                    <Button
                        component={Link}
                        to={paths.createClient}
                        variant="contained"
                        color="primary"
                    >
                        Dodaj Klienta
                    </Button>
                </Box>
            </Box>
        );
    };

export default ClientList;