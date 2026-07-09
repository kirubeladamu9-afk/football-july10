import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import blog_avata_default from '../../../../public/assets/img/blog/blog-avata-1.png';

const BlogArea = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blogs/public?limit=3');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const data = await response.json();
      setBlogs(data.blogs);
    } catch (err) {
      console.error('Error fetching blogs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <div className="tp-blog-area pb-80 pt-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-5">
              <div className="tp-blog-section-box text-center mb-50">
                <h3 className="tp-section-title-3">
                  Our Latest <span>News and Articles</span>
                </h3>
              </div>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <div className="col-12 text-center" style={{ padding: '60px 20px' }}>
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : error ? (
              <div className="col-12 text-center" style={{ padding: '60px 20px' }}>
                <p style={{ color: '#d32f2f', fontSize: '16px' }}>
                  Unable to load articles. Please try again later.
                </p>
              </div>
            ) : blogs.length > 0 ? (
              blogs.map((item) => (
                <div key={item.id} className="col-xl-4 col-lg-4 col-md-6 mb-60">
                  <div className="tp-blog-item">
                    <div className="tp-blog-thumb fix">
                      <Link href={`/blog-details?slug=${item.slug}`}>
                        {item.coverImage && (
                          <Image
                            src={item.coverImage}
                            alt={item.titleEn}
                            width={400}
                            height={300}
                          />
                        )}
                      </Link>
                    </div>
                    <div className="tp-blog-meta d-flex align-items-center">
                      <div className="tp-blog-category category-color-1">
                        <span>{item.category}</span>
                      </div>
                      <div className="tp-blog-date">
                        <span>{formatDate(item.publishDate)}</span>
                      </div>
                    </div>
                    <div className="tp-blog-title-box">
                      <Link className="tp-blog-title-sm" href={`/blog-details?slug=${item.slug}`}>
                        {item.titleEn}
                      </Link>
                    </div>
                    <div className="tp-blog-author-info-box d-flex align-items-center">
                      <div className="tp-blog-avata">
                        <Image
                          src={item.authorAvatar || blog_avata_default}
                          alt={item.authorName || 'Author'}
                          width={50}
                          height={50}
                          onError={(e) => { e.currentTarget.src = blog_avata_default.src; }}
                        />
                      </div>
                      <div className="tp-blog-author-info">
                        <h5>{item.authorName}</h5>
                        <span>{item.authorRoleEn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-center" style={{ padding: '60px 20px' }}>
                <p style={{ fontSize: '16px' }}>No articles available yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArea;
