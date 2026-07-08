import React from "react";
import SEO from "../src/common/seo";
import HomeTwo from "../src/components/homes/home-2";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Payment Gateway"} />
      <HomeTwo />
    </Wrapper>
  );
};

export default index;
