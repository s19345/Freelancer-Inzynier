import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { USERS_BACKEND_URL } from "../../settings";

const PasswordResetConfirm = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword1, setNewPassword1] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`${USERS_BACKEND_URL}password/reset/confirm/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password1: newPassword1,
          new_password2: newPassword2,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        const data = await response.json();
        setError(data?.detail || 'Co� posz�o nie tak. Spr�buj ponownie.');
      }
    } catch (err) {
      setError('Co� posz�o nie tak. Spr�buj ponownie.');
    }
  };

  return (
    <div>
      <h2>Resetowanie has�a</h2>

      {success ? (
        <p>Has�o zosta�o zmienione. Za chwil� nast�pi przekierowanie do logowania...</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>Nowe has�o</label>
            <input
              type="password"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label>Powt�rz nowe has�o</label>
            <input
              type="password"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              required
            />
          </div>

          {error && <p>{error}</p>}

          <button type="submit">
            Zmie� has�o
          </button>
        </form>
      )}
    </div>
  );
};

export default PasswordResetConfirm;