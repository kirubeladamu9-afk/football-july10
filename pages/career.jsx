import React from "react";
import SEO from "../src/common/seo";
import Career from "../src/components/career";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <Career />
    </Wrapper>
  );
};

export default index;
