import React from "react";
import SEO from "../src/common/seo";
import Register from "../src/components/register";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <Register />
    </Wrapper>
  );
};

export default index;
