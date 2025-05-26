import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from '../../redux/authThunks';

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
    return <p>Musisz byæ zalogowany, aby zobaczyæ profil u¿ytkownika.</p>;
  }

  if (!user) {
    return <p>£adowanie danych u¿ytkownika...</p>;
  }
  console.log("user", user);

  return (
    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Profil u¿ytkownika</h2>
      <p><strong>Nick:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
    </div>
  );
};

export default UserProfile;