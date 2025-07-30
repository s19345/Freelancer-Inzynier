import React, {useEffect, useState} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    MenuItem,
    InputLabel,
    Select,
    FormControl
} from '@mui/material';
import useGlobalStore from "../../zustand_store/globalInfoStore";
import {useNavigate} from "react-router";
import paths from "../../paths";
import ChangePassword from "./ChangePassword";
import SkillEditor from "./EditSkills";

const TIMEZONES = [
    'Europe/Warsaw',
    'America/New_York',
    'Asia/Tokyo',
    'Africa/Abidjan',
    'UTC'
//     todo pobieraæ z backendu
];

const EditProfile = () => {
    const user = useAuthStore((state) => state.user);
    const updateUserData = useAuthStore((state) => state.updateUserData);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: '',
        email: '',
        bio: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        location: '',
        profile_picture: null,
        timezone: '',
        specialization: '',
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                phone_number: user.phone_number || '',
                location: user.location || '',
                profile_picture: null,
                timezone: user.timezone || '',
                specialization: user.specialization || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const {name, value, files} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateUserData(form);

        if (success) {
            setMessage('Dane u¿ytkownika zosta³y zaktualizowane');
            setType('success');
            navigate(paths.userProfile);
        } else {
            setMessage('Wyst±pi³ b³±d podczas aktualizacji');
            setType('error');
        }
    };

    if (!isLoggedIn) {
        return (
            <Typography variant="body1" sx={{mt: 2, textAlign: 'center'}}>
                Musisz byæ zalogowany, aby edytowaæ profil.
            </Typography>
        );
    }

    return (
        <Box sx={{display: "flex", flexDirection: "row"}}>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 600,
                    mx: 'auto',
                    mt: 4,
                    p: 3,
                    border: '1px solid',
                    borderColor: 'grey.300',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Edytuj profil
                </Typography>

                <TextField label="Nick" name="username" value={form.username} onChange={handleChange} required
                           fullWidth/>
                <TextField label="Imiê" name="first_name" value={form.first_name} onChange={handleChange}
                           fullWidth/>
                <TextField label="Nazwisko" name="last_name" value={form.last_name} onChange={handleChange}
                           fullWidth/>
                <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange}
                           required
                           fullWidth/>
                <TextField label="Telefon" name="phone_number" value={form.phone_number} onChange={handleChange}
                           fullWidth/>
                <TextField label="Lokalizacja" name="location" value={form.location} onChange={handleChange}
                           fullWidth/>
                <TextField label="Specjalizacja" name="specialization" value={form.specialization}
                           onChange={handleChange} fullWidth/>
                <FormControl fullWidth>
                    <InputLabel>Strefa czasowa</InputLabel>
                    <Select name="timezone" value={form.timezone} label="Strefa czasowa" onChange={handleChange}>
                        {TIMEZONES.map((tz) => (
                            <MenuItem key={tz} value={tz}>
                                {tz}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    fullWidth
                />

                <Button variant="outlined" component="label">
                    Dodaj zdjêcie profilowe
                    <input type="file" name="profile_picture" hidden onChange={handleChange} accept="image/*"/>
                </Button>

                <Button variant="contained" type="submit" sx={{mt: 2}}>
                    Zapisz zmiany
                </Button>
            </Box>
            <Box>
                <ChangePassword/>
                <SkillEditor/>
            </Box>
        </Box>
    );
};

export default EditProfile;