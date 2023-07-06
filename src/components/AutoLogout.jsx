import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const tokenExpirationTime = localStorage.getItem('tokenExpirationTime');
    if (tokenExpirationTime) {
      const expirationTimestamp = parseInt(tokenExpirationTime);
      const currentTime = new Date().getTime();

      const timeRemaining = expirationTimestamp - currentTime;
      if (timeRemaining <= 0) {
        // Token has expired, perform logout actions
        logout();
      } else {
        // Schedule logout when token expires
        const logoutTimeout = setTimeout(logout, timeRemaining);

        // Store the logout timeout ID to cancel it if needed
        localStorage.setItem('logoutTimeout', logoutTimeout);
      }
    }

    return () => {
      // Clear the logout timeout when the component is unmounted
      const logoutTimeout = localStorage.getItem('logoutTimeout');
      clearTimeout(logoutTimeout);
      localStorage.removeItem('logoutTimeout');
    };
  }, []);

  const logout = () => {
    // Clear token and any user data
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationTime');

    // Redirect to the login page or display logout message
    navigate('/login');
  };

  return null;
};

export default AutoLogout;
