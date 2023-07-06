import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/style.css'

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        <li className={location.pathname === '/home' ? 'active' : ''}>
          <Link to="/home">
            <i className="fa fa-home"></i>
            <span>Home</span>
          </Link>
        </li>
        <li className={location.pathname === '/students' ? 'active' : ''}>
          <Link to="/students">
            <i className="fa fa-users"></i>
            <span>Students</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
