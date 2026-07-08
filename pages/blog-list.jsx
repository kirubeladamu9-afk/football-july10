import React from "react";
import SEO from "../src/common/seo";
import BlogList from "../src/components/blog-list";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <BlogList />
    </Wrapper>
  );
};

export default index;
