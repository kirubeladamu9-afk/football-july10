import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

const setting = {
    slidesPerView: 3,
    spaceBetween: 30,
    breakpoints: {
        '1200': {
            slidesPerView: 3,
        },
        '992': {
            slidesPerView: 2,
        },
        '768': {
            slidesPerView: 2,
        },
        '576': {
            slidesPerView: 1,
        },
        '0': {
            slidesPerView: 1,
        },
    },
}

const Portfolio = ({ blog }) => {
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedPosts = async () => {
            if (!blog || !blog.category) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`/api/blogs/public?limit=5&category=${encodeURIComponent(blog.category)}`);
                if (!response.ok) throw new Error('Failed to fetch related posts');
                const data = await response.json();
                const filtered = data.blogs.filter(post => post.id !== blog.id);
                setRelatedPosts(filtered);
            } catch (error) {
                console.error('Error fetching related posts:', error);
                setRelatedPosts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedPosts();
    }, [blog]);

    if (loading || relatedPosts.length === 0) {
        return null;
    }

    return (
        <>
            <div className="blog-grid-inner grey-bg pt-100 pb-50">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="popular-blog-title mb-40 text-center">
                                <h4>Related Posts</h4>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="blog-details-slider-wrapper">
                                <Swiper {...setting} className="swiper-container blog-slider-active pb-50">
                                    {relatedPosts.map((item, i) => {
                                        const date = new Date(item.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        });
                                        return (
                                            <SwiperSlide key={i} className="swiper-slide">
                                                <div className="tp-blog-item">
                                                    <div className="tp-blog-thumb fix">
                                                        <Link href={`/blog/${item.slug}`}>
                                                            <Image
                                                                src={item.coverImage || '/assets/img/blog/blog-1.jpg'}
                                                                alt={item.titleEn}
                                                                width={300}
                                                                height={200}
                                                            />
                                                        </Link>
                                                    </div>
                                                    <div className="tp-blog-content">
                                                        <div className="tp-blog-meta d-flex align-items-center">
                                                            <div className="tp-blog-category category-color-1">
                                                                <span>{item.category}</span>
                                                            </div>
                                                            <div className="tp-blog-date">
                                                                <span>{date}</span>
                                                            </div>
                                                        </div>
                                                        <div className="tp-blog-title-box">
                                                            <Link className="tp-blog-title-sm" href={`/blog/${item.slug}`}>{item.titleEn}</Link>
                                                        </div>
                                                        <div className="tp-blog-author-info-box d-flex align-items-center">
                                                            <div className="tp-blog-avata">
                                                                <Image
                                                                    src={item.authorAvatar || '/assets/img/blog/blog-list-avata-1.jpg'}
                                                                    alt={item.authorName}
                                                                    width={40}
                                                                    height={40}
                                                                />
                                                            </div>
                                                            <div className="tp-blog-author-info">
                                                                <h5>{item.authorName}</h5>
                                                                <span>{item.authorRoleEn || 'Author'}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </SwiperSlide>
                                        );
                                    })}
                                </Swiper>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Portfolio;
