import Logo from "../components/Logo";
import ShadowShape from "../components/ShadowShape";
import SharedForm from "../components/SharedForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./pagesStyles/Register.css";

function HealthDetails() {
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const patientInfoData = sessionStorage.getItem("patientInfoData");
    if (!patientInfoData) {
      navigate("/register");
    } else {
      const healthDetailsData = sessionStorage.getItem("healthDetailsData");
      if (healthDetailsData) {
        setInitialData(JSON.parse(healthDetailsData));
      }
    }
  }, [navigate]);

  const formInputs = [
    {
      icon: "bi-heart-pulse",
      placeholder: "Your blood sugar",
      name: "bloodSugar",
      required: true,
    },
    {
      icon: "bi-activity",
      placeholder: "Your blood pressure",
      name: "bloodPressure",
      required: true,
    },
    {
      icon: "bi-droplet",
      placeholder: "Cholesterol",
      name: "cholesterol",
      required: true,
    },
    {
      icon: "bi-capsule",
      placeholder: "Other Diseases",
      name: "otherDiseases",
    },
  ];

  const handleFormSubmit = (formData) => {
    sessionStorage.setItem("healthDetailsData", JSON.stringify(formData));

    const registerData = JSON.parse(
      sessionStorage.getItem("registerFormData") || "{}"
    );
    const patientData = JSON.parse(
      sessionStorage.getItem("patientInfoData") || "{}"
    );

    const completeUserData = {
      ...registerData,
      patientInfo: patientData,
      healthDetails: formData,
    };

    sessionStorage.setItem("userData", JSON.stringify(completeUserData));

    navigate("/dashboard");
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
          title="Health details"
          headerIcon="bi-person-check"
          inputs={formInputs}
          showGender={false}
          onSubmit={handleFormSubmit}
          initialData={initialData}
          formClassName="health-details-form"
        />
      </div>
    </div>
  );
}

export default HealthDetails;
