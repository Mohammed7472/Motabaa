import Logo from "../components/Logo";
import RegistrationMethods from "../components/RegistrationMethods";
import "../components/componentsStyles/registerAs.css";

function RegisterAs() {
  return (
    <div className="register-as-page">
      <div className="logo-wrapper">
        <Logo v={"200px"} h={"200px"} bgColor={"#2E99DC8A"} />
      </div>
      <RegistrationMethods />
    </div>
  );
}

export default RegisterAs;
