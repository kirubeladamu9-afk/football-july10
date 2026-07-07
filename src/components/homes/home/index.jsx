import ScrollToTop from "@/src/hooks/scroll-to-top";
import Footer from "@/src/layout/footers/footer";
import Header from "@/src/layout/headers/header";
import React from "react";
import AboutArea from "../../../common/about-area";
import FeatureArea from "./feature-area";
import HeroSlider from "./hero-slider";
import ProjectArea from "./project-area";
import ServicesArea from "./services-area";

const HomeOne = () => {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
      <div id="smooth-content">
      <main className="fix">
      <HeroSlider />
      <FeatureArea />
      <AboutArea />
      <ServicesArea />
      <ProjectArea />
      </main> 
      <Footer />
      <ScrollToTop />
      </div>
      </div>
    </>
  );
};

export default HomeOne;
