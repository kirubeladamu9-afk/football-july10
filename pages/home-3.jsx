import React from "react";
import SEO from "../src/common/seo";
import HomeThree from "../src/components/homes/home-3";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <HomeThree />
    </Wrapper>
  );
};

export default index;
