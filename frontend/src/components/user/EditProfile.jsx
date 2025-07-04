import React, {useEffect, useState} from 'react';
import useAuthStore from "../../zustand_store/authStore";

const EditProfile = () => {
    const user = useAuthStore((state) => state.user);
    const updateUserData = useAuthStore((state) => state.updateUserData);
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const [form, setForm] = useState({
        username: '',
        email: '',
        bio: ''
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                bio: user.bio || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setForm((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await updateUserData(form);

        if (success) {
            setMessage('Dane u�ytkownika zosta�y zaktualizowane');
        } else {
            setMessage('Wyst�pi� b��d podczas aktualizacji');
        }
    };

    if (!isLoggedIn) {
        return <p>Musisz by� zalogowany, aby edytowa� profil.</p>;
    }

    return (
        <div style={{padding: '2rem', maxWidth: '500px', margin: 'auto'}}>
            <h2>Edytuj profil</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Nick:</label><br/>
                    <input
                        id="username"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label><br/>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bio">Bio:</label><br/>
                    <textarea
                        id="bio"
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows={4}
                    />
                </div>
                <button type="submit" style={{marginTop: '1rem'}}>Zapisz zmiany</button>
            </form>
            {message && <p style={{marginTop: '1rem'}}>{message}</p>}
        </div>
    );
};

export default EditProfile;
