import React from "react";
import SEO from "../src/common/seo";
import Team from "../src/components/team";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <Team />
    </Wrapper>
  );
};

export default index;
