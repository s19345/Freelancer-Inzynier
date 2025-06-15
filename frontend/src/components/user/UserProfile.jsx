import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/authThunks';
import { Link } from 'react-router';


const UserProfile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUser());
    }
  }, []);

  if (!isLoggedIn) {
    return <p>Musisz być zalogowany, aby zobaczyć profil użytkownika.</p>;
  }

  if (!user) {
    return <p>Ładowanie danych użytkownika...</p>;
  }

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Profil użytkownika</h2>
      <p><strong>Nick:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio}</p>

      <Link to="/edit-profile">
        <button style={{ marginTop: '1rem' }}>Edytuj profil</button>
      </Link>

      <Link to="/change-password">
        <button style={{ marginTop: '1rem' }}>Zmień hasło</button>
      </Link>
    </div>
  );
};

export default UserProfile;
