import VideoPopup from '@/src/modals/video-popup';
import SearchIcon from '@/src/svg/search-icon';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import Categories from './categories';
import RecentPost from './recent-post';
import Search from './search';
import Tags from './tags';


import img_1 from "../../../public/assets/img/blog/blog-list-1.jpg";
import img_2 from "../../../public/assets/img/blog/blog-list-3.jpg";
import Image from 'next/image';


const PostboxArea = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs/public?limit=10');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();

        const formattedBlogs = data.blogs.map(blog => ({
          id: blog.id,
          slug: blog.slug,
          img: blog.coverImage || img_1,
          cls: "format-image",
          slider_img: false,
          category: blog.category || "Resources",
          date: blog.publishDate ? new Date(blog.publishDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Recently",
          readingTime: blog.readingTime || 5,
          video: [],
          title: blog.titleEn,
          des: blog.excerptEn || blog.titleEn,
        }));
        setBlogs(formattedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);
  
    return (
        <>
        <div className="postbox__area pb-100">
            <div className="container">
               <div className="row">
                  <div className="col-xxl-8 col-xl-8 col-lg-8">
                     <div id="blog" className="postbox__wrapper pr-20">
                        {(blogs && blogs.length > 0 ? blogs : []).map((item, i)  =>
                            <article key={i} className={`postbox__item ${item.cls} mb-70 transition-3`}>
                                {item.img &&
                                    <div className="postbox__thumb w-img">
                                        <Link href={`/blog-details?id=${item.id}`}>
                                            <Image src={item.img} alt={item.title} />
                                        </Link>
                                    </div>
                                }
                                {item.video  &&
                                item.video.map((videoItem, vidIdx) =>
                                    <div key={vidIdx} className="postbox__thumb postbox__video w-img  p-relative">
                                        <Link href={`/blog-details?id=${item.id}`}>
                                            <Image src={videoItem.video_tum} alt={item.title} />
                                        </Link>
                                        {/* video modal start */}
                                        <VideoPopup
                                            isVideoOpen={isVideoOpen}
                                            setIsVideoOpen={setIsVideoOpen}
                                            videoId={videoItem.videoId}
                                        />
                                        {/* video modal end */}
                                        <button onClick={() => setIsVideoOpen(true)}
                                        className="play-btn pulse-btn popup-video"
                                        ><i className="fas fa-play"></i></button>
                                    </div>

                                )
                                }

                                <div className="postbox__content">
                                    <div className="postbox__meta">
                                        <span><Link href="#">{item.category}</Link></span>
                                        <span><Link href="#">{item.date} • {item.readingTime} min read</Link></span>
                                    </div>
                                    <h3 className="postbox__title">
                                        <Link href={`/blog-details?id=${item.id}`}>{item.title}</Link>
                                    </h3>
                                    <div className="postbox__text">
                                        <p>{item.des}</p>
                                    </div>
                                    <div className="postbox__btn mt-35">
                                        <Link className="tp-btn-inner tp-btn-hover alt-color-black" href={`/blog-details?id=${item.id}`}>
                                            <span>Read More</span>
                                            <b></b>
                                        </Link>
                                    </div>
                                </div>
                            </article>

                            )
                        } 

                        <div className="basic-pagination">
                           <nav>
                              <ul>
                                 <li>
                                    <Link href="/blog">
                                       <i className="far fa-angle-left"></i>
                                    </Link>
                                 </li>
                                 <li>
                                    <Link className="current" href="/blog">1</Link>
                                 </li>
                                 <li>
                                    <Link href="/blog">2</Link>
                                 </li>
                                 <li>
                                    <span>...</span>
                                 </li>
                                 <li>
                                    <Link href="/blog">3</Link>
                                 </li>
                                 <li>
                                    <Link href="/blog">
                                       <i className="far fa-angle-right"></i>
                                    </Link>
                                 </li>
                              </ul>
                              </nav>
                        </div>
                     </div>
                  </div>

                  <div className="col-xxl-4 col-xl-4 col-lg-4">
                     <div className="sidebar__wrapper"> 
                        <Search />
                        <RecentPost />  
                        <Categories /> 
                        <Tags /> 
                     </div>
                  </div>
               </div>
            </div>
         </div>            
        </>
    );
};

export default PostboxArea;
