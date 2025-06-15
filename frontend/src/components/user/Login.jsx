import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import PasswordReset from './PasswordReset';
import useAuthStore from "../../zustand_store/authStore";
import {createAsyncThunk} from "@reduxjs/toolkit";
import {USERS_BACKEND_URL} from "../../settings";

const Login = () => {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [showReset, setShowReset] = useState(false);

    const loading = useAuthStore(state => state.loading)
    const error = useAuthStore(state => state.error);
    const setLoading = useAuthStore(state => state.setLoading);
    const setError = useAuthStore(state => state.setError);
    const setToken = useAuthStore(state => state.setToken);
    const setIsLoggedIn = useAuthStore(state => state.setIsLoggedIn);


    async function loginUser() {
        try {
            setLoading(true)
            const res = await fetch(`${USERS_BACKEND_URL}login/`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    username: nickname,
                    password: password,
                }),
            });
            if (res.ok) {
                const data = await res.json()
                setToken(data.key)
                setIsLoggedIn(true)
                navigate("/")
            } else {
                const err = await res.json()
                setError(err.non_field_errors[0] || "Błędne dane")
            }

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        loginUser()
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nickname">Nick:</label><br/>
                    <input
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Hasło:</label><br/>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Zaloguj
                </button>
            </form>
            <button onClick={() => setShowReset(!showReset)}>Zapomniałeś hasła?</button>
            {showReset && <PasswordReset/>}
            {error && <p style={{color: 'red'}}>❌ {error}</p>}
        </div>
    );
};

export default Login;
