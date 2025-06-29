import React, {useEffect, useState} from "react";
import useAuthStore from "../../zustand_store/authStore";
import {PROJECT_BACKEND_URL} from "../../settings";
import {Link} from 'react-router';

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
                setClients(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, [token]);

    if (loading) return <p>Ładowanie klientów...</p>;
    if (error) return <p>Błąd: {error}</p>;

    return (
        <div>
            <h2>Lista klientów</h2>
            {clients.length === 0 ? (
                <p>Brak klientów do wyświetlenia.</p>
            ) : (
                <table>
                    <thead>
                    <tr>
                        <th>Nazwa firmy</th>
                        <th>Osoba kontaktowa</th>
                        <th>Email</th>
                        <th>Akcje</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clients.map(client => (
                        <tr key={client.id}>
                            <td>{client.company_name}</td>
                            <td>{client.contact_person}</td>
                            <td>{client.email}</td>
                            <td>
                                <Link
                                    to={`/client/${client.id}`}
                                >
                                    Szczegóły
                                </Link>
                                <Link
                                    to={`/client/${client.id}/edit`}
                                >
                                    Edytuj
                                </Link>
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ClientList;
