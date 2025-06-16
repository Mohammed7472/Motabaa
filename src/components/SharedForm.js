import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";
import ArrowButton from "./ArrowButton";
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
  useResponsiveGrid = false,
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

  const handleGenderChange = (selectedGender) => {
    setGender(selectedGender);
    setFormData((prev) => ({
      ...prev,
      gender: selectedGender,
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
      onSubmit(formData);
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

  const renderInput = (input, index) => {
    if (input.name === "gender" && !input.showAsDropdown) {
      return (
        <div className="gender-selection-container" key={index}>
          <label className="gender-label">Gender</label>
          <div className="gender-toggle-container">
            <div
              className={`gender-toggle-option ${
                formData.gender === "male" ? "selected" : ""
              }`}
              onClick={() => handleGenderChange("male")}
            >
              <i className="bi bi-gender-male"></i>
              <span>Male</span>
            </div>
            <div
              className={`gender-toggle-option ${
                formData.gender === "female" ? "selected" : ""
              }`}
              onClick={() => handleGenderChange("female")}
            >
              <i className="bi bi-gender-female"></i>
              <span>Female</span>
            </div>
          </div>
        </div>
      );
    }

    if (input.type === "select") {
      return (
        <div className="input-group" key={index}>
          <span className="icon">
            <i className={`bi ${input.icon}`}></i>
          </span>
          {input.loading ? (
            <select
              name={input.name}
              className="form-select"
              disabled
              required={input.required}
            >
              <option value="">Loading specializations...</option>
            </select>
          ) : (
            <select
              name={input.name}
              value={formData[input.name] || ""}
              onChange={handleInputChange}
              required={input.required}
              className="form-select"
            >
              <option value="" disabled>
                {input.placeholder || "Select an option"}
              </option>
              {input.options && input.options.length > 0 ? (
                input.options.map((option, idx) => (
                  <option key={idx} value={option.value}>
                    {option.label}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No options available
                </option>
              )}
            </select>
          )}
        </div>
      );
    }

    return (
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
    );
  };

  return (
    <div className="container">
      <div className={`card register-card ${formClassName}`}>
        {headerIcon && (
          <div className="mb-3 form-header-icon">
            <i className={`bi ${headerIcon}`}></i>
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
          <div
            className={`form-inputs ${
              useResponsiveGrid ? "responsive-grid" : ""
            }`}
          >
            {inputs.map((input, index) => renderInput(input, index))}
          </div>

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

          <div className="button-container">
            {onSubmit ? (
              <button type="submit" className="submit-button">
                <i className="bi bi-arrow-right-circle-fill"></i>
              </button>
            ) : (
              <ArrowButton to={nextPath} className="form-submit-btn" />
            )}
          </div>
        </form>

        {createAccountLink && (
          <Link to={createAccountLink.url} className="create-account">
            {createAccountLink.text}
          </Link>
        )}

        {showSocialLogin && (
          <div className="social-login-section">
            <div className="social-login-text">Register with</div>
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
          </div>
        )}
      </div>
    </div>
  );
}

export default SharedForm;
