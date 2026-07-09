import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import useMultipleAnime from '@/src/hooks/useMultipleAnime';
import Image from 'next/image';
import blog_avata_default from '../../../public/assets/img/blog/blog-avata-1.png';

const Portfolio = () => {
    const {dataRef} = useMultipleAnime();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

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
            setBlogs([]);
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
            <div className="blog-grid-inner mb-80">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="popular-blog-title mb-40 text-center">
                                <h4>Our Popular Posts</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row" ref={dataRef}>
                        {loading ? (
                            <div className="col-12 text-center" style={{ padding: '60px 20px' }}>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : blogs.length > 0 ? (
                            blogs.map((item, i) => (
                                <div key={i} data-index={i} className="col-xl-4 col-lg-6 col-md-6 mb-30">
                                    <div className="tp-blog-item">
                                        <div className="tp-blog-thumb fix">
                                            <Link href={`/blog-details?slug=${item.slug}`}>
                                                {item.coverImage && (
                                                    <Image src={item.coverImage} alt={item.titleEn} width={400} height={300} />
                                                )}
                                            </Link>
                                        </div>
                                        <div className="tp-blog-content">
                                            <div className="tp-blog-meta d-flex align-items-center">
                                                <div className="tp-blog-category category-color-1">
                                                    <span>{item.category}</span>
                                                </div>
                                                <div className="tp-blog-date">
                                                    <span>{formatDate(item.createdAt)}</span>
                                                </div>
                                            </div>
                                            <div className="tp-blog-title-box">
                                                <Link className="tp-blog-title-sm" href={`/blog-details?slug=${item.slug}`}>{item.titleEn}</Link>
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

export default Portfolio;
