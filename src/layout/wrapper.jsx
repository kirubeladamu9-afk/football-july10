import React, { useEffect } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
// middleware
gsap.registerPlugin(ScrollTrigger);
// internal
import ScrollToTop from "../hooks/scroll-to-top";
import { animationCreate } from "../utils/utils";

const Wrapper = ({ children }) => {
  useEffect(() => {
    // Fade in main content once spinner is hidden
    const smoothContent = document.getElementById('smooth-content');
    if (smoothContent) {
      smoothContent.classList.add('content-visible');
    }

    // animation
    setTimeout(() => {
      animationCreate();
    }, 100);
  }, []);

  return (
    <>
      {children}
      <ScrollToTop/>

      <style jsx global>{`
        #smooth-content {
          opacity: 0;
          transition: opacity 300ms ease-out 100ms;
        }

        #smooth-content.content-visible {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

export default Wrapper;
