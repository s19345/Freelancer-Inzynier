import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserData } from '../../redux/authThunks';

const EditProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
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
    const result = await dispatch(updateUserData(form));

    if (updateUserData.fulfilled.match(result)) {
      setMessage('Dane u¿ytkownika zosta³y zaktualizowane');
    } else {
      setMessage('Wyst±pi³ b³±d podczas aktualizacji');
    }
  };

  if (!isLoggedIn) {
    return <p>Musisz byæ zalogowany, aby edytowaæ profil.</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
      <h2>Edytuj profil</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Nick:</label><br />
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label><br />
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
          <label htmlFor="bio">Bio:</label><br />
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <button type="submit" style={{ marginTop: '1rem' }}>Zapisz zmiany</button>
      </form>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default EditProfile;
