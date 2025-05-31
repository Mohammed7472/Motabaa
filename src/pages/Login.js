import SharedForm from "../components/SharedForm";
import Logo from "../components/Logo";
import "./pagesStyles/Login.css";
import ShadowShape from "../components/ShadowShape";
import CircleShape from "../components/CircleShape";
import { useNavigate } from "react-router-dom";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";

function Login() {
  const navigate = useNavigate();

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

  const handleLoginSubmit = (formData) => {
    console.log("Login data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="login">
      <div className="d-flex justify-content-center">
        <CircleShape />
        <Logo bgColor="transparent" />
      </div>

      <SharedForm
        title="Sign in"
        headerIcon="bi-person-circle"
        inputs={loginInputs}
        onSubmit={handleLoginSubmit}
        showSocialLogin={true}
        socialIcons={{ facebook, google: gmail }}
        formClassName="login-form"
        createAccountLink={createAccountLink}
      />

      <ShadowShape top={"80%"} left={"99%"} v={"90px"} h={"90px"} />
      <ShadowShape top={"40%"} right={"99%"} v={"90px"} h={"80px"} />
    </div>
  );
}

export default Login;
