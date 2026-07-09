import React from "react";
import SEO from "../src/common/seo";
import ProjectDetails from "../src/components/project-details";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <ProjectDetails />
    </Wrapper>
  );
};

export default index;
