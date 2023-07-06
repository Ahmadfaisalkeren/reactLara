import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const logoutHandler = () => {
    Swal.fire({
      title: 'Logout Confirmation',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout actions
        localStorage.removeItem('token');
        // Additional logout logic...

        // Reload the page or navigate to the desired route after logout
        window.location.reload();
      }
    });
  };

  return (
    <nav style={{ backgroundColor: '#7814C6', padding: '10px', color: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '20px' }}>
          Dashboard
        </Link>
        <button
          onClick={logoutHandler}
          style={{ color: '#fff', backgroundColor: 'transparent', border: 'none' }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
