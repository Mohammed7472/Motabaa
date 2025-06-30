import SharedForm from "../components/SharedForm";
import Logo from "../components/Logo";
import "./pagesStyles/Login.css";
import ShadowShape from "../components/ShadowShape";
import CircleShape from "../components/CircleShape";
import { useNavigate } from "react-router-dom";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { useState } from "react";
import api from "../services/api";

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
    url: "/register",
  };

  const handleLoginSubmit = async (formData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Clear all existing user data from storage
      localStorage.clear();
      sessionStorage.clear();

      // Prepare the request data
      const requestData = {
        email: formData.email,
        password: formData.password,
      };

      // ...existing code...
      const response = await api.auth.login(requestData);
      // ...existing code...

      if (!response || !response.token) {
        throw new Error("Invalid response from server");
      }

      // Store authentication token in sessionStorage
      sessionStorage.setItem("authToken", response.token);

      // Create user data object from the response
      const userData = {
        id: response.id,
        email: response.email,
        userName: response.userName,
        role: response.role,
        // Add any other fields that come from the API
      };

      // Store user role directly from the API response
      const userRole = response.role;
      if (!userRole) {
        throw new Error("No role information received");
      }

      // Store user role and data in sessionStorage
      sessionStorage.setItem("userRole", userRole);
      const completeUserData = {
        id: response.id,
        email: response.email,
        userName: response.userName,
        role: userRole,
        fullName: response.userName, // Use userName as fallback for fullName
        specializationId: response.specializationid,
        phoneNumber: response.phoneNumber || response.phone || "",
        age: response.age || "",
        address: response.address || "",
        // Add any additional fields needed for the UI
      };

      sessionStorage.setItem("userData", JSON.stringify(completeUserData));
      // ...existing code...

      // Notify other components of the change
      window.dispatchEvent(new Event("storage"));

      // Navigate to dashboard
      navigate("/dashboard");
      window.location.reload(); // Force reload to hydrate context
    } catch (err) {
      // ...existing code...
      setError(
        err.message ||
          "Login failed. Please check your credentials and try again."
      );
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
