import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import ShadowShape from "../components/ShadowShape";
import "../components/componentsStyles/home.css";

function Home() {
  return (
    <div className="home">
      <ShadowShape
        top={"25%"}
        left={"95%"}
        v={"90px"}
        h={"120px"}
      ></ShadowShape>
      <Navbar />
      <div className="home-content">
        <WelcomeSection />
      </div>
    </div>
  );
}

export default Home;
