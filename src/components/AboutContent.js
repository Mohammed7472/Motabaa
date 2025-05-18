import Doctor_1 from "../images/doctor-1.png";
import Doctor_2 from "../images/doctor-2.png";
import "./componentsStyles/aboutContent.css";
function AboutContent(props) {
  return (
    <div className="about-container d-flex">
      <div className="image">
        <img src={Doctor_1} alt="doctor" />
      </div>
      <div>
        <h1>About us</h1>
        <p>
          At <span className="fw-bold">Motabaa</span>, we believe that
          healthcare starts with continuous monitoring and effective
          communication between patients and doctors. That’s why we created our
          smart platform to empower patients to record their medical data, track
          chronic conditions, and store session details and prescriptions—all in
          one place.
        </p>
        <p>
          Through <span className="fw-bold">Motabaa</span>, doctors can access
          patients' medical history, add new diagnoses within their specialty,
          and update treatment plans to ensure accurate and effective
          healthcare.
        </p>
        <p>
          Our goal is to enhance the quality of healthcare through technology,
          providing a seamless and secure medical tracking experience that
          ensures every patient receives the care they deserve.
        </p>
      </div>
      <div className="image">
        {" "}
        <img src={Doctor_2} alt="doctor" />
      </div>
    </div>
  );
}

export default AboutContent;
