import React, { useState } from 'react';
import useAuthStore from "../../zustand_store/authStore";

export default function Register() {
  const { error, loading, registerUser, setError } = useAuthStore();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password1: '',
    password2: '',
  });

  const [info, setInfo] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await registerUser(formData);

    if (success) {
      setInfo('Rejestracja zakończona sukcesem');
      setError(null);
    }
  };

  return (
    <div>
      {!info && (
        <>
          <h1>Rejestracja</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nazwa użytkownika</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password1">Hasło</label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              required
            />
            <label htmlFor="password2">Powtórz hasło</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={formData.password2}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={loading}>
              Zarejestruj
            </button>
          </form>
          {error && (
            <div>
              <h1>{error}</h1>
            </div>
          )}
        </>
      )}
      {loading && 'working...'}
      {info && (
        <div>
          <h1>{info}</h1>
        </div>
      )}
    </div>
  );
}
