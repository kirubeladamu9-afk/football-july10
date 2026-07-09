import React from "react";
import SEO from "../src/common/seo";
import Price from "../src/components/price";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <Price />
    </Wrapper>
  );
};

export default index;
