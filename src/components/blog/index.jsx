import BreadcrumbTwo from "@/src/common/breadcrumbs/breadcrumb-2";
import Footer from "@/src/layout/footers/footer";
import Header from "@/src/layout/headers/header";
import React from "react";
import BlogGrid from "./blog-grid";
import Portfolio from "./portfolio";

const Blog = () => {
  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <BreadcrumbTwo title={"Read our blogs"} innertitle={"Blog Grid Classic"} />
            <BlogGrid />
            <Portfolio />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Blog;
