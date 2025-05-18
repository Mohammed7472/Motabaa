import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyles/navbar.css";

import Logo from "./Logo";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar-container">
      <nav className="navbar navbar-expand-lg w-100">
        <div className="container-fluid">
          <div className="navbar-brand">
            <Logo />
          </div>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link fw-bold" href="/#">
                  Services
                </a>
              </li>
              <li className="nav-item">
                <Link to="/about" className="nav-link fw-bold">
                  About us
                </Link>
              </li>
            </ul>
            <div className="d-flex gap-2 auth-btns" role="search">
              <Link className="btn sign-in-btn" to="login">
                Sign in
              </Link>
              <Link className="btn register-btn" to="register">
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
