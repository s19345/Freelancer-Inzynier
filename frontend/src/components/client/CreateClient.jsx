import React, {useState} from "react";
import {PROJECT_BACKEND_URL} from "../../settings";
import useAuthStore from "../../zustand_store/authStore";
import {Box, TextField, Button, Typography} from '@mui/material';
import AutoDismissAlert from "../common/AutoDismissAlert";


const CreateClientForm = () => {
    const [formData, setFormData] = useState({
        company_name: "",
        industry: "",
        contact_person: "",
        email: "",
        phone: "",
        notes: ""
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState(null);
    const [statusType, setStatusType] = useState("success");
    const token = useAuthStore(state => state.token);

    const validate = () => {
        const newErrors = {};
        if (!formData.company_name.trim()) {
            newErrors.company_name = "Nazwa firmy jest wymagana";
        }
        if (!formData.industry.trim()) {
            newErrors.industry = "Branża jest wymagana";
        }
        if (!formData.contact_person.trim()) {
            newErrors.contact_person = "Osoba kontaktowa jest wymagana";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email jest wymagany";
        }
        if (!formData.phone.trim()) {
            newErrors.phone = "Numer Telefonu jest wymagany";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Podaj poprawny adres email";
        }
        if (formData.phone && !/^[0-9+()\-\s]{6,}$/.test(formData.phone)) {
            newErrors.phone = "Podaj poprawny numer telefonu";
        }
        return newErrors;
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await fetch(`${PROJECT_BACKEND_URL}clients/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok) {
                    setStatus({text: "Klient został utworzony pomyślnie", id: Date.now()});
                    setStatusType("success");
                    setFormData({
                        company_name: "",
                        industry: "",
                        contact_person: "",
                        email: "",
                        phone: "",
                        notes: ""
                    });
                } else {
                    const errorMessage = typeof data === "object"
                        ? Object.values(data).flat().join(" ")
                        : "Wystąpił błąd podczas tworzenia klienta";
                    setStatus({text: errorMessage, id: Date.now()});
                    setStatusType("error");
                }
            } catch (error) {
                console.error("Błąd sieci:", error);
                setStatus({text: "Błąd połączenia z serwerem", id: Date.now()});
                setStatusType("error");
            }
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                maxWidth: 400,
                mx: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
            }}
        >
            <Typography variant="h5" component="h2" textAlign="center">
                Dodaj klienta
            </Typography>

            <TextField
                label="Nazwa firmy"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                error={!!errors.company_name}
                helperText={errors.company_name}
                fullWidth
            />

            <TextField
                label="Branża"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                error={!!errors.industry}
                helperText={errors.industry}
                fullWidth
            />

            <TextField
                label="Osoba kontaktowa"
                name="contact_person"
                value={formData.contact_person}
                onChange={handleChange}
                error={!!errors.contact_person}
                helperText={errors.contact_person}
                fullWidth
            />

            <TextField
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                fullWidth
            />

            <TextField
                label="Telefon"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
            />

            <TextField
                label="Notatki"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
            />

            <Button type="submit" variant="contained" color="primary" fullWidth>
                Utwórz klienta
            </Button>

            {status && (
                <AutoDismissAlert
                    messageObj={status}
                    severity={statusType}
                    duration={3000}
                />
            )}

        </Box>
    );

};

export default CreateClientForm;
