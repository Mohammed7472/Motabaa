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

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      const vValue = typeof v === "string" ? parseInt(v) : v;
      const hValue = typeof h === "string" ? parseInt(h) : h;

      if (window.innerWidth <= 576) {
        // Mobile
        setShadowSize({
          v: typeof v === "string" ? `${vValue * 0.5}px` : vValue * 0.5,
          h: typeof h === "string" ? `${hValue * 0.5}px` : hValue * 0.5,
        });
      } else if (window.innerWidth <= 768) {
        // Tablet
        setShadowSize({
          v: typeof v === "string" ? `${vValue * 0.7}px` : vValue * 0.7,
          h: typeof h === "string" ? `${hValue * 0.7}px` : hValue * 0.7,
        });
      } else if (window.innerWidth <= 992) {
        // Small desktop
        setShadowSize({
          v: typeof v === "string" ? `${vValue * 0.85}px` : vValue * 0.85,
          h: typeof h === "string" ? `${hValue * 0.85}px` : hValue * 0.85,
        });
      } else if (window.innerWidth >= 1400) {
        // Large screens
        setShadowSize({
          v: typeof v === "string" ? `${vValue * 1.2}px` : vValue * 1.2,
          h: typeof h === "string" ? `${hValue * 1.2}px` : hValue * 1.2,
        });
      } else {
        // Default (medium desktop)
        setShadowSize({ v, h });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [v, h, windowWidth]);

  const topValue =
    typeof top === "string" && top.includes("%") ? `${parseInt(top)}%` : top;

  const leftValue =
    typeof left === "string" && left.includes("%")
      ? `${parseInt(left)}%`
      : left;

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
