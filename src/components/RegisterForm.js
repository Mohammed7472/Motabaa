import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/form.css";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

function RegisterForm() {
  const { option } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    specialty: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    sessionStorage.setItem("registerFormData", JSON.stringify(formData));

    
    if (option === "patient") {
      navigate(`/register/${option}/info`);
    } else {
      
      navigate("/dashboard");
    }
  };

  return (
    <>
      <div className="container">
        <div className="card register-card">
          <h2>{option === "doctor" ? "Doctor" : "Patient"} Register</h2>
          <div className="profile-upload mx-auto mb-3">
            <i
              className="bi bi-camera-fill"
              style={{ fontSize: "40px", color: "rgb(0 0 0 / 70%)" }}
            ></i>
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
    </>
  );
}
export default RegisterForm;
