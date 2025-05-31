import { useEffect, useState } from "react";

export default function ShadowShape({
  top = 0,
  left = 0,
  v = "100px",
  h = "150px",
  bgColor = "#2e99dc57",
}) {
  const [shadowSize, setShadowSize] = useState({ v, h });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);

      const vValue = typeof v === "string" ? parseInt(v) : v;
      const hValue = typeof h === "string" ? parseInt(h) : h;

      
      let scaleFactor = 1;

      if (window.innerWidth <= 576 || window.innerHeight <= 500) {
        
        scaleFactor = 0.4;
      } else if (window.innerWidth <= 768 || window.innerHeight <= 700) {
        
        scaleFactor = 0.6;
      } else if (window.innerWidth <= 992) {
        
        scaleFactor = 0.8;
      } else if (window.innerWidth >= 1400) {
        
        scaleFactor = 1.1;
      }

      setShadowSize({
        v:
          typeof v === "string"
            ? `${vValue * scaleFactor}px`
            : vValue * scaleFactor,
        h:
          typeof h === "string"
            ? `${hValue * scaleFactor}px`
            : hValue * scaleFactor,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [v, h]);

  
  let topValue =
    typeof top === "string" && top.includes("%") ? top : `${top}px`;
  let leftValue =
    typeof left === "string" && left.includes("%") ? left : `${left}px`;

  
  if (parseInt(topValue) > 85 && topValue.includes("%")) {
    topValue = "85%";
  }
  if (parseInt(leftValue) > 85 && leftValue.includes("%")) {
    leftValue = "85%";
  }

  
  if (windowHeight <= 500) {
    const vValue = typeof v === "string" ? parseInt(v) : v;
    const hValue = typeof h === "string" ? parseInt(h) : h;

    setShadowSize({
      v: typeof v === "string" ? `${vValue * 0.3}px` : vValue * 0.3,
      h: typeof h === "string" ? `${hValue * 0.3}px` : hValue * 0.3,
    });
  }

  const shapeStyle = {
    position: "absolute",
    width: "10px",
    height: "10px",
    top: topValue,
    left: leftValue,
    right: leftValue === "100%" ? 0 : "auto",
    zIndex: -1,
    borderRadius: "50%",
    backgroundColor: bgColor,
    boxShadow: `0 0 ${shadowSize.v} ${shadowSize.h} ${bgColor}`,
    pointerEvents: "none",
  };

  return <div className="shadow-shape" style={shapeStyle}></div>;
}
