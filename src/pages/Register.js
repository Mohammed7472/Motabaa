import { useParams, useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import RectangleShape from "../components/RectangleShape";
import SharedForm from "../components/SharedForm";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { useState } from "react";
import "./pagesStyles/Register.css";
import api from '../services/api';

function Register() {
  const { option } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [initialData, setInitialData] = useState(() => {
    const savedData = sessionStorage.getItem("registerFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  
  const commonInputs = [
    {
      icon: "bi-person-fill",
      placeholder: "Full Name",
      name: "fullName",
      required: true,
    },
    {
      icon: "bi-envelope-fill",
      placeholder: "Email",
      name: "email",
      type: "email",
      required: true,
    },
    {
      icon: "bi-key-fill",
      placeholder: "Password",
      name: "password",
      type: "password",
      required: true,
    },
    {
      icon: "bi-calendar-fill",
      placeholder: "Age",
      name: "age",
      type: "number",
      required: true,
    },
    {
      icon: "bi-telephone-fill",
      placeholder: "Phone Number",
      name: "phone",
      required: true,
    },
    {
      icon: "bi-geo-alt-fill",
      placeholder: "Address",
      name: "address",
      required: true,
    },
    {
      icon: "bi-gender-ambiguous",
      name: "gender",
      showAsDropdown: false,
      required: true,
    },
  ];

  
  const doctorInputs = [
    commonInputs[0], 
    {
      icon: "bi-person-badge-fill",
      placeholder: "Your Specialty",
      name: "specialty",
      required: true,
    },
    ...commonInputs.slice(1), 
  ];

  const inputs = option === "doctor" ? doctorInputs : commonInputs;

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Store form data in session storage for potential use later
      sessionStorage.setItem("registerFormData", JSON.stringify(formData));
      
      // Prepare the request data
      const requestData = {
        userName: formData.email,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        age: parseInt(formData.age),
        phoneNumber: formData.phone,
        address: formData.address,
        gender: formData.gender
      };
      
      // Add specialty for doctor registration
      if (option === "doctor") {
        requestData.specialty = formData.specialty;
      }
      
      // Use the API client instead of fetch
      let data;
      if (option === "doctor") {
        data = await api.auth.registerDoctor(requestData);
      } else {
        data = await api.auth.registerPatient(requestData);
      }
      
      console.log("Registration successful:", data);
      
      // Store user data including any tokens returned from the API
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // Navigate to dashboard on success
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred during registration. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="logo-container">
        <Link to="/">
          <Logo v={"150px"} h={"150px"} bgColor={"#2E99DC"} />
        </Link>
      </div>

      <div className="register-header">
        <h1 className="register-title">
          {option === "doctor" ? "Doctor Registration" : "Patient Registration"}
        </h1>
        <p className="register-subtitle">
          Create your account to join our healthcare platform
        </p>
      </div>

      <div className="container">
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        
        <SharedForm
          title={`Create Account`}
          headerIcon="bi-person-badge"
          inputs={inputs}
          showProfileUpload={true}
          showSocialLogin={true}
          socialIcons={{ facebook, google: gmail }}
          onSubmit={handleFormSubmit}
          initialData={initialData}
          useResponsiveGrid={true}
          isLoading={isLoading}
          createAccountLink={{
            url: "/login",
            text: "Already have an account? Login",
          }}
        />
      </div>

      <div className="back-link">
        <Link to="/register-as">
          <i className="bi bi-arrow-left"></i> Back
        </Link>
      </div>

      <RectangleShape />
    </div>
  );
}

export default Register;
