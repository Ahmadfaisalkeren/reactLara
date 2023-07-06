import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/home');
    }
  }, []);

  const loginHandler = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/login', formData);
      localStorage.setItem('token', response.data.access_token);
      
      // Display SweetAlert2 popup
      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'You have successfully logged in.',
      });
      
      navigate('/home');
    } catch (error) {
      console.log(error.response.data);
      setValidation(error.response.data);
    }
  };
  
  
  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="col-md-6">
        <div className="card">
          <div className="card-body d-flex justify-content-between flex-column">
            {validation.error && (
              <div className="alert alert-danger" role="alert">
                {validation.error}
              </div>
            )}
            <h5 className="card-title">Login</h5>
            <form onSubmit={loginHandler}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {validation.email && (
                  <small className='text-danger'>
                    {validation.email[0]}
                  </small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">Password</label>
                <input type="password" className="form-control" id="password_confirmation" value={password} onChange={(e) => setPassword(e.target.value)} />
                {validation.password && (
                  <small className='text-danger'>
                    {validation.password[0]}
                  </small>
                )}
              </div>
              <button type="submit" className="btn btn-primary">Login</button>
              <p className="text-center">Don't have an account? <Link to="/register">Register</Link></p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
