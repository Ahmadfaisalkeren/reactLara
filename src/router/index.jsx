import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Student from '../pages/Student';
import Home from '../pages/Home';
import StudentLayout from '../pages/StudentLayout';
import AutoLogout from '../components/AutoLogout';

function MyRouter() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token && !window.location.pathname.includes('/register')) {
      // Redirect to login if token is not found and the path is not /register
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AutoLogout />} /> {/* Add AutoLogout as a Route */}
      {token ? (
        <>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/students" element={<StudentLayout />}>
            <Route index element={<Student />} />
          </Route>
        </>
      ) : (
        <>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
        </>
      )}
    </Routes>
  );
}

export default MyRouter;
