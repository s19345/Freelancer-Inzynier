import React, {useEffect, useState} from 'react';
import useAuthStore from "../../zustand_store/authStore";
import {
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    InputLabel,
    Select,
    FormControl
} from '@mui/material';
import useGlobalStore from "../../zustand_store/globalInfoStore";
import {useNavigate} from "react-router";
import ChangePassword from "./ChangePassword";
import SkillEditor from "./EditSkills";
import {fetchTimezones} from "../fetchers";
import paths from "../../paths";


const EditProfile = () => {
    const [timezones, setTimezones] = useState([]);
    const token = useAuthStore((state) => state.token);

    useEffect(() => {
        fetchTimezones(token).then(setTimezones)
    }, [token]);

    const user = useAuthStore((state) => state.user);
    const updateUserData = useAuthStore((state) => state.updateUserData);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const setMessage = useGlobalStore((state) => state.setMessage);
    const setType = useGlobalStore((state) => state.setType);
    const navigate = useNavigate();
    const [isEdited, setIsEdited] = useState(false);
    const [errors, setErrors] = useState({});

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
        const response = await updateUserData(form);
        if (!response.success) {
            setErrors(response);
        } else if (response.success) {
            setErrors({})
            setMessage('Profil zaktualizowany pomyślnie');
            setType('success');
            navigate(paths.userProfile);
        }


    };

    if (!isLoggedIn) {
        return (
            <Typography variant="body1" sx={{mt: 2, textAlign: 'center'}}>
                Musisz być zalogowany, aby edytować profil.
            </Typography>
        );
    }

    return (
        <Box sx={{display: "flex", flexDirection: "row", gap: 3, flexWrap: "wrap",}}>
            <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{
                    width: "50%",
                    minWidth: 300,
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

                <TextField
                    label="Nick"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    required
                    fullWidth
                />
                <TextField
                    label="Imię"
                    name="first_name"
                    value={form.first_name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.first_name}
                    helperText={errors.first_name}
                />
                <TextField
                    label="Nazwisko"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.last_name}
                    helperText={errors.last_name}
                />
                <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    label="Telefon"
                    name="phone_number"
                    value={form.phone_number}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                />
                <TextField
                    label="Lokalizacja"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.location}
                    helperText={errors.location}
                />
                <TextField
                    label="Specjalizacja"
                    name="specialization"
                    value={form.specialization}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors.specialization}
                    helperText={errors.specialization}
                />
                <FormControl fullWidth>
                    <InputLabel>Strefa czasowa</InputLabel>
                    <Select name="timezone" value={form.timezone} label="Strefa czasowa" onChange={handleChange}>
                        {timezones.map((tz) => (
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
                <Box sx={{display: "flex", flexDirection: "row"}}>
                    <Button variant="contained" type="submit" sx={{mt: 2, width: "50%"}}>
                        Zapisz zmiany
                    </Button>

                    <Button
                        sx={{mt: 2, ml: 2, width: "50%"}}
                        variant="outlined"
                        onClick={() => setIsEdited(!isEdited)}

                    >
                        Zmień hasło
                    </Button>
                </Box>
            </Box>
            <Box sx={{flex: 1}}>
                <SkillEditor/>
                {isEdited &&
                    <ChangePassword setIsEdited={setIsEdited}/>
                }
            </Box>
        </Box>
    );
};

export default EditProfile;
