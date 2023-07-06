import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css'

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [validation, setValidation] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/students');
    }
  }, []);

  const registerHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);

    try {
      await axios.post('http://127.0.0.1:8000/api/auth/register', formData);

      Swal.fire({
        icon: 'success',
        title: 'Welcome!',
        text: 'You have successfully Registered, Now Please Login',
      });

      navigate('/login');
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
            <h5 className="card-title">Register</h5>
            <form onSubmit={registerHandler}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="name"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {validation.name && (
                  <small className="text-danger">{validation.name[0]}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {validation.email && (
                  <small className="text-danger">{validation.email[0]}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {validation.password && (
                  <small className="text-danger">{validation.password[0]}</small>
                )}
              </div>
              <div className="mb-3">
                <label htmlFor="password_confirmation" className="form-label">
                  Password Confirmation
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password_confirmation"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              <p className="text-center">
                Already have an account? <Link to="/">Login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
