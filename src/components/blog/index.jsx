import BreadcrumbTwo from "@/src/common/breadcrumbs/breadcrumb-2";
import Footer from "@/src/layout/footers/footer";
import Header from "@/src/layout/headers/header";
import React from "react";
import BlogGrid from "./blog-grid";
import Portfolio from "./portfolio";
import { useLanguage } from "@/src/hooks/useLanguage";
import translations from "@/src/i18n/translations";

const Blog = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations['en'];

  return (
    <>
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <BreadcrumbTwo title={t.blog.blogGridTitle} innertitle={t.blog.blogGridClassic} />
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
