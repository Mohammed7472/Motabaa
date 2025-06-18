import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./componentsStyles/navbar.css";

import Logo from "./Logo";
import { Link } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (window.scrollY > 50) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }

    setLoaded(true);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navbarClass = loaded
    ? `navbar-container ${scrolled ? "scrolled" : "top"}`
    : "navbar-container top";

  return (
    <div className={navbarClass} style={{ boxShadow: scrolled ? "" : "none" }}>
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
              {" "}
              <li className="nav-item">
                <Link to="/services" className="nav-link fw-bold">
                  Services
                </Link>
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
