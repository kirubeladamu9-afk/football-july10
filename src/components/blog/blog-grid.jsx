import Image from 'next/image';
import Link from 'next/link';
import React, {useState , useEffect} from 'react';
import { EffectFade, Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// author img import here
import author_img_1 from "../../../public/assets/img/blog/blog-avata-3.png";
import author_img_2 from "../../../public/assets/img/blog/blog-avata-2.png";
import author_img_3 from "../../../public/assets/img/blog/blog-avata-1.png";

const setting = {
    slidesPerView: 1,
    effect:'fade',
    // arrows:false,
    breakpoints: {
        '1200': {
            slidesPerView: 1,
        },
        '992': {
            slidesPerView: 1,
        },
        '768': {
            slidesPerView: 1,
        },
        '576': {
            slidesPerView: 1,
        },
        '0': {
            slidesPerView: 1,
        },
    },
    navigation: {
        nextEl: '.grid-next',
        prevEl: '.grid-prev',
    },
  }

const BlogGrid = () => {
    const [isLoop, setIsLoop] = useState(false)
    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
       setIsLoop(true)
    }, [])

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/blogs/public?limit=6')
                if (!response.ok) throw new Error('Failed to fetch blogs')
                const data = await response.json()
                const formattedBlogs = data.blogs.map((blog, index) => {
                    const authorImgs = [author_img_1, author_img_2, author_img_3]
                    return {
                        id: blog.id,
                        slug: blog.slug,
                        bg_img: blog.coverImage || "/assets/img/blog/inner-blog-1.png",
                        child_1: blog.category || "Resources",
                        date: blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently",
                        title: blog.titleEn,
                        des: blog.excerptEn || blog.titleEn,
                        author_img: blog.authorAvatar || authorImgs[index % authorImgs.length],
                        author_name: blog.authorName || "Author",
                        author_info: blog.authorRoleEn || "Content Creator",
                    }
                })
                setBlogs(formattedBlogs)
            } catch (error) {
                console.error('Error fetching blogs:', error)
                setBlogs([])
            } finally {
                setLoading(false)
            }
        }
        fetchBlogs()
    }, [])
    
    return (
        <>
             <div className="blog-grid-area pt-100 pb-100">
                <div className="container">
                    <div className="row">
                    <div className="col-12">
                        <div className="blog-grid-arrow p-relative">
                            <div className="grid-next d-none d-sm-block">
                                <button>
                                <i className="far fa-angle-left"></i>
                                <svg width="36" height="100" viewBox="0 0 36 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4.99999 14C0 7.5 0.5 3.5 0 0L-0.000484467 99.5C-0.000415802 96.7234 1.00003 88 23 71.5C44.9999 55 32.5 37.1667 24 30.5C19.8333 27.1667 9.48375 19.8289 4.99999 14Z" fill="white"/>
                                </svg>
                                </button>
                            </div>
                            <div className="grid-prev d-none d-sm-block">
                                <button>
                                <i className="far fa-angle-right"></i>
                                <svg width="36" height="100" viewBox="0 0 36 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M30.3164 14C35.3164 7.5 34.8164 3.5 35.3164 0L35.3169 99.5C35.3168 96.7234 34.3164 88 12.3164 71.5C-9.68354 55 2.81642 37.1667 11.3164 30.5C15.4831 27.1667 25.8327 19.8289 30.3164 14Z" fill="white"/>
                                </svg>
                                </button>
                            </div>
                            <Swiper
                            {...setting}
                            loop={isLoop}
                            modules={[Navigation, EffectFade]}
                            className="swiper-container blog-grid-slider-active">
                                {(blogs && blogs.length > 0 ? blogs : []).map((item, i)  =>
                                        <SwiperSlide key={i} className="swiper-slide">
                                            <div  className="blog-grid-slider blog-grid-slider-bg d-flex align-items-center blog-grid-slider-height"
                                                        style={{backgroundImage: `url(${item.bg_img})`}}>
                                            <div className="blog-grid-slider-wrapper">
                                                <div className="blog-grid-slider-meta">
                                                    <span className="child-one">{item.child_1}</span>
                                                    <span className="child-two">{item.date}</span>
                                                </div>
                                                <div className="blog-grid-slider-title-box">
                                                    <h4 className="blog-grid-slider-title"><Link href={`/blog-details?id=${item.id}`}>{item.title}</Link></h4>
                                                    <p> {item.des}</p>
                                                </div>
                                                <div className="tp-blog-author-info-box blog-grid-avata-box d-flex align-items-center">
                                                    <div className="tp-blog-avata">
                                                        <Image src={item.author_img} alt="theme-pure" />
                                                    </div>
                                                    <div className="tp-blog-author-info">
                                                        <h5>{item.author_name}</h5>
                                                        <span>{item.author_info}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        </SwiperSlide>
                                 )}
                            </Swiper>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogGrid;
