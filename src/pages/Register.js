import { useParams, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import RectangleShape from "../components/RectangleShape";
import ShadowShape from "../components/ShadowShape";
import SharedForm from "../components/SharedForm";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { useState } from "react";
import "./pagesStyles/Register.css";

function Register() {
  const { option } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(() => {
    const savedData = sessionStorage.getItem("registerFormData");
    return savedData ? JSON.parse(savedData) : {};
  });

  const baseInputs = [
    {
      icon: "bi-person-fill",
      placeholder: "Full Name",
      name: "fullName",
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

  const inputs =
    option === "doctor"
      ? [
          ...baseInputs.slice(0, 1),
          {
            icon: "bi-person-add",
            placeholder: "Your Specialty",
            name: "specialty",
            required: true,
          },
          ...baseInputs.slice(1),
        ]
      : baseInputs;

  const handleFormSubmit = (formData) => {
    sessionStorage.setItem("registerFormData", JSON.stringify(formData));

    if (option === "patient") {
      navigate(`/register/${option}/info`);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="register-page">
      <div className="logo-container">
        <Logo v={"150px"} h={"150px"} bgColor={"#2E99DC"} />
      </div>

      <ShadowShape left="99%" top="25%" v="160px" />

      <div className="container">
        <SharedForm
          title={`${option === "doctor" ? "Doctor" : "Patient"} Register`}
          headerIcon="bi-person-badge"
          inputs={inputs}
          showProfileUpload={true}
          showSocialLogin={true}
          socialIcons={{ facebook, google: gmail }}
          onSubmit={handleFormSubmit}
          initialData={initialData}
        />
      </div>

      <RectangleShape />
    </div>
  );
}

export default Register;
