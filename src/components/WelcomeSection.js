import { useEffect, useState } from "react";
import intro from "../images/home-intro.png";
import CircleShape from "./CircleShape";
import "./componentsStyles/welcome.css";

function WelcomeSection() {
  const [screenSize, setScreenSize] = useState({
    height: window.innerHeight,
    width: window.innerWidth,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isLandscapeMobile =
    screenSize.height < 500 && screenSize.width > screenSize.height;

  return (
    <div className="welcome">
      <div className="intro-content mx-auto">
        <div className="img-box">
          <img src={intro} alt="Welcome to our website" />
        </div>
        <div className="intro-heading">
          <h1>Your Life Matters</h1>
        </div>
      </div>
      <CircleShape top="50%" />
    </div>
  );
}

export default WelcomeSection;
