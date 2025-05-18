import Logo from "../components/Logo";
import ShadowShape from "../components/ShadowShape";
import SharedForm from "../components/SharedForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pagesStyles/Register.css";

function PatientInformation() {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const registrationData = sessionStorage.getItem("registerFormData");
    if (!registrationData) {
      navigate("/register");
    } else {
      const patientInfoData = sessionStorage.getItem("patientInfoData");
      if (patientInfoData) {
        setInitialData(JSON.parse(patientInfoData));
      }
    }
  }, [navigate]);

  const formInputs = [
    {
      icon: "bi-gender-ambiguous",
      placeholder: "Your Age",
      name: "age",
      required: true,
    },
    {
      icon: "bi-rulers",
      placeholder: "Your Height",
      name: "height",
      required: true,
    },
    {
      icon: "bi-speedometer2",
      placeholder: "Your Weight",
      name: "weight",
      required: true,
    },
  ];

  const handleFormSubmit = (formData) => {
    sessionStorage.setItem("patientInfoData", JSON.stringify(formData));
    navigate("/healthDetails");
  };

  return (
    <div className="register-page">
      <div className="logo-container">
        <Logo v={"130px"} h={"150px"} bgColor={"#2E99DC"} />
      </div>

      <ShadowShape left="99%" top="25%" v="160px" />
      <ShadowShape left="50%" top="-15%" v="160px" />
      <ShadowShape left="99%" top="95%" v="160px" h="120px" />

      <div className="container">
        <SharedForm
          title="More Information"
          headerIcon="bi-person-video"
          inputs={formInputs}
          showGender={true}
          onSubmit={handleFormSubmit}
          initialData={initialData}
          formClassName="patient-info-form"
        />
      </div>
    </div>
  );
}

export default PatientInformation;
