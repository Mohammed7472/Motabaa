import "./componentsStyles/circleShape.css";
function CircleShape({ top = 0 }) {
  return (
    <div
      className="circle-shape"
      style={{
        top: top,
        clipPath:
          top === 0 ? "circle(80% at 50% -85%)" : "circle(70% at 50% 125%)",
      }}
    ></div>
  );
}

export default CircleShape;
