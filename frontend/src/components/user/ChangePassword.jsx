import React, {useState, useEffect} from 'react';
import useAuthStore from "../../zustand_store/authStore";


const ChangePassword = () => {
    const {loading, error, successMessage, resetError, changePassword} = useAuthStore();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    useEffect(() => {
        return () => {
            resetError();
        };
    }, [resetError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword1 !== newPassword2) {
            alert("Nowe has�a nie s� takie same!");
            return;
        }
        await changePassword({oldPassword, newPassword1, newPassword2});
    };

    return (
        <div style={{padding: '2rem'}}>
            <h2>Zmie� has�o</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Aktualne has�o:</label><br/>
                    <input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Nowe has�o:</label><br/>
                    <input
                        type="password"
                        value={newPassword1}
                        onChange={(e) => setNewPassword1(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Powt�rz nowe has�o:</label><br/>
                    <input
                        type="password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>Zmie� has�o</button>
            </form>

            {error && <p style={{color: 'red'}}> {error}</p>}
            {successMessage && <p style={{color: 'green'}}> {successMessage}</p>}
        </div>
    );
};

export default ChangePassword;
