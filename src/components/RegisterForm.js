import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/form.css";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";
import { useUser } from "../context/UserContext";

function RegisterForm() {
  const { option } = useParams(); // "doctor" or "patient"
  const navigate = useNavigate();
  const { loginUser } = useUser(); // لو عندك دالة loginUser في الكونتكست بتحدث الحالة
  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setValidationErrors({});

    try {
      // Prepare payload
      const payload = {
        fullName: formData.fullName,
        password: formData.password,
      };

      let result;
      if (option === "doctor") {
        payload.specializationName = formData.specialty;
        result = await api.auth.registerDoctor(payload);
      } else {
        result = await api.auth.registerPatient(payload);
      }
      
      // If we get here, registration was successful
      localStorage.setItem("authToken", result.token);
      loginUser(result);
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle validation errors (typically status 400 with errors object)
      if (err.isValidationError && err.validationErrors) {
        setValidationErrors(err.validationErrors);
        
        // Set a general error message
        setError("Please correct the validation errors below.");
      } 
      // Handle problem+json format errors
      else if (err.type && err.message) {
        setError(`${err.message}${err.data?.detail ? `: ${err.data.detail}` : ''}`);
      }
      // Handle any other errors
      else {
        setError(err.message || "Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="container">
      <div className="card register-card">
        <h2>{option === "doctor" ? "Doctor" : "Patient"} Register</h2>

        {error && (
          <div className="error-message" style={{ color: "red", marginBottom: "12px", textAlign: "center", padding: "8px", backgroundColor: "#ffebee", borderRadius: "4px" }}>
            {error}
          </div>
        )}
        
        {/* Display validation errors if any */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="validation-errors" style={{ marginBottom: "12px", textAlign: "left", padding: "8px", backgroundColor: "#fff8e1", borderRadius: "4px" }}>
            <ul style={{ margin: "0", paddingLeft: "20px" }}>
              {Object.entries(validationErrors).map(([field, errors]) => (
                <li key={field} style={{ color: "#d32f2f" }}>
                  <strong>{field}:</strong> {Array.isArray(errors) ? errors.join(', ') : errors}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="profile-upload mx-auto mb-3">
          <i className="bi bi-camera-fill" style={{ fontSize: "40px", color: "rgb(0 0 0 / 70%)" }}></i>
          <input type="file" accept="image/*" />
          <div className="plus-icon">+</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="icon">
              <i className="bi bi-person-fill"></i>
            </span>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          {option === "doctor" && (
            <div className="input-group">
              <span className="icon">
                <i className="bi bi-person-add"></i>
              </span>
              <input
                type="text"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="Your Specialty"
                required
              />
            </div>
          )}

          <div className="input-group">
            <span className="icon">
              <i className="bi bi-key-fill"></i>
            </span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>

          <button type="submit" className="go-btn">
            <i className="bi bi-arrow-right-circle"></i>
          </button>
        </form>

        <div>Register with</div>
        <div className="social">
          <span className="facebook-icon">
            <img src={facebook} alt="Facebook" />
          </span>
          <span className="google-icon">
            <img src={gmail} alt="Gmail" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm;
