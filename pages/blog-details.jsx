import React from "react";
import SEO from "../src/common/seo";
import BlogDetails from "../src/components/blog-details";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <BlogDetails />
    </Wrapper>
  );
};

export default index;
