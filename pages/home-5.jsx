import React from "react";
import SEO from "../src/common/seo";
import HomeFive from "../src/components/homes/home-5";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <HomeFive />
    </Wrapper>
  );
};

export default index;
