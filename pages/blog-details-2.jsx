import React from "react";
import SEO from "../src/common/seo";
import BlogDetailsTwo from "../src/components/blog-details-2";
import Wrapper from "../src/layout/wrapper";

const index = () => {
  return (
    <Wrapper>
      <SEO pageTitle={"Softec - Data analytics"} />
      <BlogDetailsTwo />
    </Wrapper>
  );
};

export default index;
