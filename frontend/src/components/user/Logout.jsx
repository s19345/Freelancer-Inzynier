import { useEffect } from 'react';
import useAuthStore from "../../zustand_store/authStore";

const Logout = () => {
  const logoutUser = useAuthStore((state) => state.logout);

  useEffect(() => {
    logoutUser();
  }, [logoutUser]);

  return null;
};

export default Logout;
