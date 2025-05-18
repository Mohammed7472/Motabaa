import { useState } from "react";
import { Link } from "react-router-dom";
import "../components/componentsStyles/patientInfoForm.css";

function PatientInfoForm() {
  const [gender, setGender] = useState("");

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };
  return (
    <>
      <div className="container">
        <div className="card register-card">
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
              class="bi bi-person-video"
              style={{ fontSize: "40px", color: "#fff" }}
            ></i>
          </div>
          <h2>More Information</h2>
          <div className="input-group">
            <span className="icon">
              <i class="bi bi-backpack4"></i>
            </span>
            <input type="text" placeholder="Your Age" />
          </div>

          <div className="input-group">
            <span className="icon">
              <i class="bi bi-align-top"></i>
            </span>
            <input type="text" placeholder="Your Height" />
          </div>

          <div className="input-group">
            <span className="icon">
              <i class="bi bi-clipboard"></i>
            </span>
            <input type="text" placeholder="Your Weight" />
          </div>

          <div className="gender-group mt-3 mb-3">
            <div className="d-flex justify-content-center gap-4">
              <div className="gender-option" onClick={() => setGender("male")}>
                <input
                  type="radio"
                  name="gender"
                  id="male"
                  value="male"
                  checked={gender === "male"}
                  onChange={handleGenderChange}
                  className="d-none"
                />
                <label
                  htmlFor="male"
                  className={`gender-icon ${
                    gender === "male" ? "selected" : ""
                  }`}
                >
                  <i className="bi bi-gender-male fs-1"></i>
                </label>
              </div>
              <div
                className="gender-option"
                onClick={() => setGender("female")}
              >
                <input
                  type="radio"
                  name="gender"
                  id="female"
                  value="female"
                  checked={gender === "female"}
                  onChange={handleGenderChange}
                  className="d-none"
                />
                <label
                  htmlFor="female"
                  className={`gender-icon ${
                    gender === "female" ? "selected" : ""
                  }`}
                >
                  <i className="bi bi-gender-female fs-1"></i>
                </label>
              </div>
            </div>
          </div>

          <Link className="go-btn" to="/healthDetails">
            <i className="bi bi-arrow-right-circle"></i>
          </Link>
        </div>
      </div>
    </>
  );
}

export default PatientInfoForm;
