import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/authThunks';

const Logout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutUser());
  }, [dispatch]);

  return null;
};

export default Logout;
