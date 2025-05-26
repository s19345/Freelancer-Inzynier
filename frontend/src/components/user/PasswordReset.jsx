import React, { useState } from 'react';
import {USERS_BACKEND_URL} from '../../settings';


const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(`${USERS_BACKEND_URL}password/reset/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data;
      }

      setSuccessMessage('Link do resetu has�a zosta� wys�any na podany adres e-mail.');
    } catch (error) {
      if (error?.email) {
        setErrorMessage(error.email.join(' '));
      } else {
        setErrorMessage('Wyst�pi� b��d podczas resetowania has�a.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>Resetowanie has�a</h2>

      <label htmlFor="email">Adres e-mail:</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        style={{ width: '100%', marginBottom: '1rem' }}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Wysy�anie...' : 'Wy�lij link resetuj�cy'}
      </button>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
  );
};

export default PasswordReset;