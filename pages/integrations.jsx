import React from "react";
import SEO from "../src/common/seo";
import Integrations from "../src/components/integrations";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <Integrations />
    </Wrapper>
  );
};

export default index;
