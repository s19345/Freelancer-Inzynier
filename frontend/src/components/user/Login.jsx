import React, {useState} from 'react';
import {useNavigate} from 'react-router';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../../redux/authThunks';
import PasswordReset from './PasswordReset';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {loading, error} = useSelector((state) => state.auth);

    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [showReset, setShowReset] = useState(false);

  const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(loginUser({nickname, password}));

        if (loginUser.fulfilled.match(result)) {
            navigate('/');
        }
    };

  return (
        <div style={{padding: '2rem'}}>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="nickname">Nick:</label><br/>
                    <input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Has³o:</label><br/>
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
            <button onClick={() => setShowReset(!showReset)}>Zapomnia³e¶ has³a?</button>
            {showReset && <PasswordReset/>}
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
};

export default Login;