import React, {useCallback, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router';
import useAuthStore from '../../zustand_store/authStore';
import {PROJECT_BACKEND_URL} from '../../settings';

import paths from "../../paths";
import useGlobalStore from "../../zustand_store/globalInfoStore";
import ClientForm from "./ClientForm";

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

    const fetchClient = useCallback(async () => {
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
                industry: data.industry || '',
                email: data.email || '',
                phone: data.phone || '',
                notes: data.notes || '',
            });
        } catch (err) {
            console.error(err)
        }
    }, [clientId, token])

    useEffect(() => {


        fetchClient();
    }, [fetchClient]);

    const handleSubmit = async (formData) => {

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
            console.error(err.message);
        }
    };

    return (
        <ClientForm
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            submitMessage={"Zapisz zmiany"}
        />
    );
};

export default EditClient;
