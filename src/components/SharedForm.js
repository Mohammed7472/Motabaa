import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/SharedFormStyle.css";

function SharedForm({
  title,
  headerIcon,
  inputs = [],
  showGender = false,
  nextPath,
  onSubmit,
  showProfileUpload = false,
  showSocialLogin = false,
  socialIcons = {},
  formClassName = "",
  initialData = {},
  createAccountLink = null,
  renderAfterInputs = null,
}) {
  const [formData, setFormData] = useState(() => {
    const initialFormData = inputs.reduce((acc, input) => {
      acc[input.name] = "";
      return acc;
    }, {});
    return { ...initialFormData, ...initialData };
  });

  const [gender, setGender] = useState(initialData.gender || "");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData((prevData) => ({ ...prevData, ...initialData }));
      if (initialData.gender) {
        setGender(initialData.gender);
      }
    }
  }, [initialData]);

  const handleGenderChange = (gender) => {
    setGender(gender);
    setFormData((prev) => ({
      ...prev,
      gender,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ ...formData, gender });
    }
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="container">
      <div className={`card register-card ${formClassName}`}>
        {headerIcon && (
          <div
            className="mb-3"
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#2E99DC8A",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 auto",
              border: "2px solid #2E99DC8A",
            }}
          >
            <i
              className={`bi ${headerIcon}`}
              style={{ fontSize: "40px", color: "#fff" }}
            ></i>
          </div>
        )}

        {title && <h2>{title}</h2>}

        {showProfileUpload && (
          <div className="profile-upload mx-auto mb-3">
            <i
              className="bi bi-camera-fill"
              style={{ fontSize: "40px", color: "rgb(0 0 0 / 70%)" }}
            ></i>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
            />
            <div className="plus-icon">+</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {inputs.map((input, index) => (
            <div className="input-group" key={index}>
              <span className="icon">
                <i className={`bi ${input.icon}`}></i>
              </span>
              <input
                type={input.type || "text"}
                name={input.name}
                value={formData[input.name] || ""}
                onChange={handleInputChange}
                placeholder={input.placeholder}
                required={input.required}
              />
            </div>
          ))}

          {showGender && (
            <div className="gender-group">
              <div
                className={`gender-icon ${
                  gender === "female" ? "selected" : ""
                }`}
                onClick={() => handleGenderChange("female")}
              >
                <i className="bi bi-gender-female"></i>
              </div>
              <div
                className={`gender-icon ${gender === "male" ? "selected" : ""}`}
                onClick={() => handleGenderChange("male")}
              >
                <i className="bi bi-gender-male"></i>
              </div>
            </div>
          )}

          {renderAfterInputs && renderAfterInputs()}

          {onSubmit ? (
            <button type="submit" className="go-btn">
              <i className="bi bi-arrow-right-circle"></i>
            </button>
          ) : (
            <Link className="go-btn" to={nextPath}>
              <i className="bi bi-arrow-right-circle"></i>
            </Link>
          )}
        </form>

        {createAccountLink && (
          <Link to={createAccountLink.url} className="create-account">
            {createAccountLink.text}
          </Link>
        )}

        {showSocialLogin && (
          <>
            <div>Register with</div>
            <div className="social">
              {socialIcons.facebook && (
                <span className="facebook-icon">
                  <img src={socialIcons.facebook} alt="Facebook" />
                </span>
              )}
              {socialIcons.google && (
                <span className="google-icon">
                  <img src={socialIcons.google} alt="Google" />
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SharedForm;
