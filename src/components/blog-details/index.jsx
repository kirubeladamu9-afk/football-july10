import BreadcrumbSix from "@/src/common/breadcrumbs/breadcrumb-6";
import Footer from "@/src/layout/footers/footer";
import Header from "@/src/layout/headers/header";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Banner from "./banner";
import Portfolio from "./portfolio";
import PostboxArea from "./postbox-area";

const BlogDetails = () => {
  const router = useRouter();
  const { id, slug } = router.query;
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If slug is provided (from /blog/[slug] route), use it
    // If id is provided as query param, fetch by id
    // Otherwise show static content for backward compatibility

    if (!slug && !id) {
      setLoading(false);
      return;
    }

    const fetchBlog = async () => {
      try {
        setLoading(true);
        const endpoint = slug
          ? `/api/blogs/public-detail?slug=${encodeURIComponent(slug)}`
          : `/api/blogs/public-detail?id=${id}`;

        const response = await fetch(endpoint);
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
  }, [slug, id]);

  // Loading state
  if (loading) {
    return (
      <>
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
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <Header />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <main className="blog-error-wrapper">
              <div className="blog-error-container">
                <h2>Blog Not Found</h2>
                <p>{error}</p>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  // Render blog with data if available, otherwise render static content
  return (
    <>
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
    </>
  );
};

export default BlogDetails;
