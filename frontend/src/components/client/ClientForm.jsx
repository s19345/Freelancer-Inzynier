import React, {useState} from "react";
import {Box, TextField, Typography, Card} from '@mui/material';
import paths from "../../paths";
import {Link} from "react-router";
import SubmitButton from "../common/SubmitButton";
import StdButton from "../common/StdButton";

const FieldBox = ({children, title, ...props}) => {
    return (
        <Box sx={{display: "flex", flexDirection: "column", gap: 1, width: "100%", mt: 1}} {...props}>
            <Typography variant="h6">{title}</Typography>
            {children}
        </Box>
    );
};

const RowBox = ({children, ...props}) => {
    return (
        <Box sx={{display: "flex", flexDirection: "row", gap: 3}} {...props}>
            {children}
        </Box>
    );
}

const ClientForm = ({handleSubmit, formData, setFormData, submitMessage}) => {


    const [errors, setErrors] = useState({});


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
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Podaj poprawny adres email";
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

    const handleLocalSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            handleSubmit(formData);
        }
    };

    return (
        <Box>

            <Box
                component="form"
                onSubmit={handleLocalSubmit}
                noValidate
                sx={{
                    mx: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Card sx={{p: 2}}>
                    <RowBox>
                        <FieldBox title="Nazwa firmy">
                            <TextField
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleChange}
                                error={!!errors.company_name}
                                helperText={errors.company_name}
                                fullWidth
                            />
                        </FieldBox>
                        <FieldBox title="Branża">
                            <TextField
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                                error={!!errors.industry}
                                helperText={errors.industry}
                                fullWidth
                            />
                        </FieldBox>
                    </RowBox>
                    <RowBox>
                        <FieldBox title="Osoba kontaktowa">
                            <TextField
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                                error={!!errors.contact_person}
                                helperText={errors.contact_person}
                                fullWidth
                            />
                        </FieldBox>
                        <FieldBox title="Email">
                            <TextField
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                fullWidth
                            />
                        </FieldBox>
                        <FieldBox title="Telefon">
                            <TextField
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                fullWidth
                            />
                        </FieldBox>
                    </RowBox>
                    <FieldBox title="Notatki">
                        <TextField
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            multiline
                            minRows={4}
                            fullWidth
                        />
                    </FieldBox>
                </Card>
                <Box
                    sx={{display: "flex", flexDirection: "row", gap: 5, mt: 2, mr: 10, justifyContent: "flex-end"}}>
                    <SubmitButton type={"submit"} label={submitMessage}/>
                    <StdButton
                        label="Anuluj"
                        component={Link}
                        to={paths.clients}
                        variant="outlined"
                        color="secondary"
                    >
                        Anuluj
                    </StdButton>
                </Box>
            </Box>


        </Box>
    );
};

export default ClientForm;
