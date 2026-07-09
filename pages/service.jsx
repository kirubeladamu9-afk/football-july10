import React from "react";
import SEO from "../src/common/seo";
import Service from "../src/components/service";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <Service />
    </Wrapper>
  );
};

export default index;
