import React, {useEffect, useState} from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Chip,
    Stack,
    CircularProgress,
} from '@mui/material';
import useAuthStore from "../../zustand_store/authStore";
import {USERS_LIST_URL} from "../../settings";
import {fetchUserSkills} from "../helpers";


const SkillEditor = ({initialSkills = []}) => {
    const API_URL = USERS_LIST_URL + 'skills/';
    const token = useAuthStore((state) => state.token);
    const [skills, setSkills] = useState(initialSkills);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        const newSkills = input
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s && !skills.includes(s));

        if (newSkills.length === 0) return;
        console.log('Dodawanie umiejêtno¶ci:', newSkills);
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({skills: newSkills}),
            });

            if (!res.ok) {
                throw new Error('B³±d dodawania umiejêtno¶ci')
            }
            ;
            const data = await res.json();
            setSkills((prev) => [...prev, ...newSkills]);
            setInput('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (skill) => {
        setLoading(true);
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({add: [], remove: [skill]}),
            });

            if (!res.ok) throw new Error('B³±d usuwania umiejêtno¶ci');

            setSkills((prev) => prev.filter((s) => s !== skill));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadSkills = async () => {
            const fetchedSkills = await fetchUserSkills();
            setSkills(fetchedSkills);
        };
        loadSkills();
    }, []);

    return (
        <Box
            sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                mt: 4,
            }}
        >
            <Typography variant="h6" gutterBottom>
                Twoje umiejêtno¶ci
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                {skills && skills.map((skill) => (
                    <Chip
                        key={skill.id}
                        label={skill.name}
                        onDelete={() => handleDelete(skill)}
                        color="primary"
                        sx={{mb: 1}}
                    />
                ))}
            </Stack>

            <Stack direction="row" spacing={2}>
                <TextField
                    label="Dodaj umiejêtno¶ci (oddziel przecinkami)"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    fullWidth
                    disabled={loading}
                />
                <Button
                    variant="contained"
                    onClick={handleAdd}
                    disabled={loading || input.trim() === ''}
                >
                    {loading ? <CircularProgress size={24}/> : 'Dodaj'}
                </Button>
            </Stack>
        </Box>
    );
};

export default SkillEditor;