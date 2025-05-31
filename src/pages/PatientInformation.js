import Logo from "../components/Logo";
import ShadowShape from "../components/ShadowShape";
import SharedForm from "../components/SharedForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pagesStyles/Register.css";

function PatientInformation() {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});
  const [registeredData, setRegisteredData] = useState({});

  useEffect(() => {
    const registrationData = sessionStorage.getItem("registerFormData");
    if (!registrationData) {
      navigate("/register");
    } else {
      setRegisteredData(JSON.parse(registrationData));

      const patientInfoData = sessionStorage.getItem("patientInfoData");
      if (patientInfoData) {
        setInitialData(JSON.parse(patientInfoData));
      }
    }
  }, [navigate]);

  const formInputs = [
    {
      icon: "bi-rulers",
      placeholder: "Your Height (cm)",
      name: "height",
      required: true,
    },
    {
      icon: "bi-speedometer2",
      placeholder: "Your Weight (kg)",
      name: "weight",
      required: true,
    },
  ];

  const handleFormSubmit = (formData) => {
    
    const combinedData = { ...registeredData, ...formData };
    sessionStorage.setItem("patientInfoData", JSON.stringify(formData));
    sessionStorage.setItem("patientFullData", JSON.stringify(combinedData));
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
          title="Health Information"
          headerIcon="bi-heart-pulse-fill"
          inputs={formInputs}
          showGender={false}
          onSubmit={handleFormSubmit}
          initialData={initialData}
          formClassName="patient-info-form"
          useResponsiveGrid={true}
        />
      </div>
    </div>
  );
}

export default PatientInformation;
