import React from "react";
import SEO from "../src/common/seo";
import ServiceDetails from "../src/components/service-details";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <ServiceDetails />
    </Wrapper>
  );
};

export default index;
