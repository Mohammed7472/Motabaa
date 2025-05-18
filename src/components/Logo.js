import { Link } from "react-router-dom";
import logoImage from "../images/logo.png";
import ShadowShape from "./ShadowShape";
import "./componentsStyles/logo.css";

function Logo(props) {
  const { h, v, bgColor, hideText, compact } = props;

  return (
    <Link className={`logo-container ${compact ? "logo-compact" : ""}`} to="/">
      <ShadowShape h={h} v={v} bgColor={bgColor} />
      <img src={logoImage} alt="MOTABAA Logo" className="logo-img" />
      {!hideText && <span className="logo-text mt-1">MOTABAA</span>}
    </Link>
  );
}

export default Logo;
