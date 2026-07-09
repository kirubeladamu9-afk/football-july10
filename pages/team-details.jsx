import React from "react";
import SEO from "../src/common/seo";
import TeamDetails from "../src/components/team-details";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <TeamDetails /> 
    </Wrapper>
  );
};

export default index;
