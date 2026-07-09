import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import SEO from "../../src/common/seo";
import Wrapper from "../../src/layout/wrapper";
import Header from "../../src/layout/headers/header";
import Footer from "../../src/layout/footers/footer";
import BreadcrumbSix from "../../src/common/breadcrumbs/breadcrumb-6";
import Banner from "../../src/components/blog-details/banner";
import PostboxArea from "../../src/components/blog-details/postbox-area";
import Portfolio from "../../src/components/blog-details/portfolio";

const BlogDetail = () => {
  const router = useRouter();
  const { slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/public-detail?slug=${encodeURIComponent(slug)}`);
        if (!response.ok) {
          throw new Error("Blog not found");
        }
        const data = await response.json();
        setBlog(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (!slug) return null;

  if (loading) {
    return (
      <Wrapper>
        <SEO pageTitle="Loading..." />
        <Header />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="blog-loading-wrapper">
              <div className="blog-loading-container">
                <div className="blog-loading-spinner"></div>
                <p>Loading blog...</p>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </Wrapper>
    );
  }

  if (error || !blog) {
    return (
      <Wrapper>
        <SEO pageTitle="Blog Not Found" />
        <Header />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="blog-error-wrapper">
              <div className="blog-error-container">
                <h2>Blog Not Found</h2>
                <p>{error || "The blog you're looking for doesn't exist."}</p>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <SEO pageTitle={`${blog.titleEn} - Softec`} />
      <Header />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <BreadcrumbSix blog={blog} />
            <Banner blog={blog} />
            <PostboxArea blog={blog} />
            <Portfolio />
          </main>
          <Footer />
        </div>
      </div>
    </Wrapper>
  );
};

export default BlogDetail;
