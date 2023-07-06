import React from "react";
import { Link } from "react-router-dom";

function NavItems({ isLoggedIn, logoutHandler }) {
  if (isLoggedIn) {
    return (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/students">
            Student
          </Link>
        </li>
        <li className="nav-item">
          <button className="nav-link btn btn-link" onClick={logoutHandler}>
            Logout
          </button>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/">
            Login
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Register
          </Link>
        </li>
      </>
    );
  }
}

export default NavItems;
