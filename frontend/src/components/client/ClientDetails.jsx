import React, {useEffect, useState} from 'react';
import {useParams, Link} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';

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

    if (loading) return <p>Ładowanie danych klienta...</p>;
    if (error) return <p>Błąd: {error}</p>;
    if (!client) return <p>Nie znaleziono klienta.</p>;

    return (
        <div>
            <h2>Szczegóły klienta</h2>
            <p><strong>Nazwa firmy:</strong> {client.company_name}</p>
            <p><strong>Osoba kontaktowa:</strong> {client.contact_person}</p>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Telefon:</strong> {client.phone || 'Brak danych'}</p>
            <p><strong>Adres:</strong> {client.address || 'Brak danych'}</p>
            {/* inne pola z w API */}

            <Link to="/clients">
                &larr; Powrót do listy klientów
            </Link>
        </div>
    );
};

export default ClientDetails;
