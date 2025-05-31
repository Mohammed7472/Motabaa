import { Link } from "react-router-dom";
import Doctor from "../images/Doctor 1.png";
import Patient from "../images/Patient 1.png";
import "./componentsStyles/registration.css";
import RectangleShape from "./RectangleShape";

function RegistrationMethods() {
  return (
    <div className="registration-methods-page">
      <div className="reg-container">
        <h1>Register as</h1>
        <div className="options">
          <Link to="/register/doctor" className="card">
            <div className="image">
              <img src={Doctor} alt="Doctor" />
            </div>
            <div className="user-option">
              <h3>Doctor</h3>
            </div>
          </Link>
          <Link to="/register/patient" className="card">
            <div className="image">
              <img src={Patient} alt="Patient" />
            </div>
            <div className="user-option">
              <h3>Patient</h3>
            </div>
          </Link>
        </div>
        <Link to="/login" className="login-link">
          Already have an account? <span>Login</span>
        </Link>
      </div>
      <RectangleShape />
    </div>
  );
}

export default RegistrationMethods;
