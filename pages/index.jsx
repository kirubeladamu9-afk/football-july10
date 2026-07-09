import React from "react";
import SEO from "../src/common/seo";
import HomeOne from "../src/components/homes/home";
import Wrapper from "../src/layout/wrapper";

const Home = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Football Governance & Tactics"} />
      <HomeOne />
    </Wrapper>
  );
};

export default Home;
