import React from "react";
import SEO from "../src/common/seo";
import About from "../src/components/about";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <About />
    </Wrapper>
  );
};

export default index;
