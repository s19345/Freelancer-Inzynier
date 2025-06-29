import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';
import DeleteClient from "./DeleteClient";

const EditClient = () => {
    const {clientId} = useParams();
    const token = useAuthStore(state => state.token);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
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
                    address: data.address || '',
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
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
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

            navigate(`/client/${clientId}`);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <p>Ładowanie danych klienta...</p>;
    if (error) return <p>Błąd: {error}</p>;

    return (
        <div>
            <h2>Edytuj klienta</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nazwa firmy</label>
                    <input
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Osoba kontaktowa</label>
                    <input
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Telefon</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Adres</label>
                    <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    Zapisz zmiany
                </button>
            </form>

            <DeleteClient clientId={clientId}/>

        </div>
    );
};

export default EditClient;
