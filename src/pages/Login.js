import SharedForm from "../components/SharedForm";
import Logo from "../components/Logo";
import "./pagesStyles/Login.css";
import ShadowShape from "../components/ShadowShape";
import CircleShape from "../components/CircleShape";
import { useNavigate } from "react-router-dom";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { useState } from "react";
import api from '../services/api';

function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loginInputs = [
    {
      icon: "bi-envelope-fill",
      placeholder: "Enter your email",
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
  ];

  const createAccountLink = {
    text: (
      <>
        I need to <strong>create an account</strong>
      </>
    ),
    url: "/register-as",
  };

  const handleLoginSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Prepare the request data
      const requestData = {
        email: formData.email,
        password: formData.password
      };
      
      console.log("Login request data:", requestData);
      
      // Use the API client
      const data = await api.auth.login(requestData);
      
      console.log("Login successful:", data);
      
      // Store authentication token
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      
      // Store user data if needed
      if (data.user) {
        localStorage.setItem("userData", JSON.stringify(data.user));
      }
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="d-flex justify-content-center">
        <CircleShape />
        <Logo bgColor="transparent" />
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <SharedForm
        title="Sign in"
        headerIcon="bi-person-circle"
        inputs={loginInputs}
        onSubmit={handleLoginSubmit}
        showSocialLogin={true}
        socialIcons={{ facebook, google: gmail }}
        formClassName="login-form"
        createAccountLink={createAccountLink}
        isLoading={isLoading}
      />

      <ShadowShape top={"80%"} left={"99%"} v={"90px"} h={"90px"} />
      <ShadowShape top={"40%"} right={"99%"} v={"90px"} h={"80px"} />
    </div>
  );
}

export default Login;
