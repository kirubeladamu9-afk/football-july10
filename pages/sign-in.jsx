import React from "react";
import SEO from "../src/common/seo";
import SignIn from "../src/components/sign-in";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <SignIn />
    </Wrapper>
  );
};

export default index;
