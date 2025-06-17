import "bootstrap-icons/font/bootstrap-icons.css";
import "./componentsStyles/form.css";
import facebook from "../images/facebook.png";
import gmail from "../images/gmail.png";
import { Link } from "react-router-dom";

function Form() {
  return (
    <div className="container">
      <div className="card">
        <h2>Sign in</h2>
        <div className="input-group">
          <span className="icon">
            <i className="bi bi-person-fill"></i>
          </span>
          <input type="text" placeholder="ID Or User Name" />
        </div>
        <div className="input-group">
          <span className="icon">
            <i className="bi bi-key-fill"></i>
          </span>
          <input type="password" placeholder="Password" />
        </div>
        <button className="go-btn">
          <i className="bi bi-arrow-right-circle"></i>
        </button>{" "}
        <Link
          to="/register"
          className="create-account"
          style={{ color: "#2E99DC" }}
        >
          I need to{" "}
          <span style={{ fontWeight: "bold" }}>create an account</span>
        </Link>
        <div>Sign in with</div>
        <div className="social">
          <span className="facebook-icon">
            <img src={facebook} alt="Facebook" />
          </span>
          <span className="google-icon">
            <img src={gmail} alt="Gmail" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Form;
