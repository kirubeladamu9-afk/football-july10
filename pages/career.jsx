import React from "react";
import SEO from "../src/common/seo";
import Career from "../src/components/career";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <Career />
    </Wrapper>
  );
};

export default index;
