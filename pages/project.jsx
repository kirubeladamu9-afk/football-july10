import React from "react";
import SEO from "../src/common/seo";
import Project from "../src/components/project";
import Wrapper from "../src/layout/wrapper";

const indx = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <Project />
    </Wrapper>
  );
};

export default indx;
