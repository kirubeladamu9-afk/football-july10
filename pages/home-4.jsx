import React from "react";
import SEO from "../src/common/seo";
import HomeFour from "../src/components/homes/home-4";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <HomeFour />
    </Wrapper>
  );
};

export default index;
