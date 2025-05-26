import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../redux/authThunks';

export default function Register() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

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
    const resultAction = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(resultAction)) {
      setInfo(resultAction.payload);
    }
  };

  return (
    <div className="login-container">
      {!info && (
        <>
          <h1>Rejestracja</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nazwa u¿ytkownika</label>
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
            <label htmlFor="password1">Has³o</label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={formData.password1}
              onChange={handleChange}
              required
            />
            <label htmlFor="password2">Powtórz has³o</label>
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
            <div className="error-message">
              <h1>{error}</h1>
            </div>
          )}
        </>
      )}
      {loading && 'working...'}
      {info && (
        <div className="info-message">
          <h1>{info}</h1>
        </div>
      )}
    </div>
  );
}