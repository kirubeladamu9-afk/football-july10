import React from "react";
import SEO from "../src/common/seo";
import CareerDetails from "../src/components/career-details";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <CareerDetails />
    </Wrapper>
  );
};

export default index;
