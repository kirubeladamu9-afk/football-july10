import Image from 'next/image';
import Link from 'next/link';
import React, {useState, useEffect} from 'react';
import useMultipleAnime from '@/src/hooks/useMultipleAnime';
import { useLanguage } from '@/src/hooks/useLanguage';
import { getTranslatedField } from '@/src/utils/i18n';

const Portfolio = () => {
   const {dataRef} = useMultipleAnime();
   const { language } = useLanguage();
   const [activeCategory, setActiveCategory] = useState("All");
   const [items, setItems] = useState([]);
   const [allBlogs, setAllBlogs] = useState([]);
   const [categories, setCategories] = useState(["All"]);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const response = await fetch('/api/blogs/public?limit=12')
            if (!response.ok) throw new Error('Failed to fetch blogs')
            const data = await response.json()

            const formattedBlogs = data.blogs.map((blog, index) => {
               const locale = language === 'am' ? 'am-ET' : 'en-US';
               return {
                  id: blog.id,
                  slug: blog.slug,
                  thumb_img: blog.coverImage && blog.coverImage.trim() ? blog.coverImage : `/assets/img/blog/blog-grid-${(index % 6) + 1}.jpg`,
                  category: getTranslatedField(blog, 'category', language) || "Blog",
                  date: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' }) : "Recently",
                  title: getTranslatedField(blog, 'title', language),
                  avata_img: (blog.authorAvatar && blog.authorAvatar.trim()) ? blog.authorAvatar : "/assets/img/blog/blog-avata-1.png",
                  name: blog.authorName || "Author",
                  job_title: getTranslatedField(blog, 'authorRole', language) || "Writer",
               }
            })

            setAllBlogs(formattedBlogs)
            setItems(formattedBlogs)

            const uniqueCategories = ["All", ...new Set(formattedBlogs.map(item => item.category))]
            setCategories(uniqueCategories)
         } catch (error) {
            console.error('Error fetching blogs:', error)
         }
      }
      fetchBlogs()
   }, [language])

    const filterItems = (cateItem) => {
      setActiveCategory(cateItem);

      if (cateItem === "All") {
        return setItems(allBlogs);
      } else {
        const findItems = allBlogs.filter((findItem) => {
          return findItem.category == cateItem;
        });
        setItems(findItems);
      }
    };

    return (
        <>
            <div className="portfolio blog-grid-inner mb-80">
               <div className="container">
                  <div className="row justify-content-center">
                     <div className="col-lg-8">
                        <div className="tp-about__section-box text-center mb-40">
                           <h4 className="inner-section-subtitle">OVER 150K+ CLIENT</h4>
                           <h3 className="tp-section-title">Accomplish more, Together</h3>
                           <p>Softuch blog is your knowledge center for everything remote.</p>
                        </div>
                     </div>
                  </div>
                  <div className="row">
                     <div className="col-xl-12">
                        <div className="portfolio-filter masonary-menu text-center mb-35">
                        {categories.map((cate, i) => (
                        <button
                           onClick={() => filterItems(cate)}
                           key={i}
                           className={`${cate === activeCategory ? "active" : ""}`}
                        >
                           <span>{cate}</span>
                        </button>
                        ))} 
                        </div>
                     </div>
                  </div>
                  <div className="row grid blog-grid-inner" ref={dataRef}>
               
                     {items.map((item, i ) =>
                        <div key={i} data-index={i} className="col-xl-4 col-lg-6 col-md-6 mb-30 grid-item cat1 cat4 cat3 cat5">
                           <div className="tp-blog-item">
                              <div className="tp-blog-thumb fix">
                                 <Link href={`/blog/${item.slug}`}><Image src={item.thumb_img} alt={item.title} width={400} height={300} style={{color: 'transparent'}} /></Link>
                              </div>
                              <div className="tp-blog-content">
                                 <div className="tp-blog-meta d-flex align-items-center">
                                    <div className="tp-blog-category category-color-1">
                                       <span>{item.category}</span>
                                    </div>
                                    <div className="tp-blog-date">
                                       <span>{item.date}</span>
                                    </div>
                                 </div>
                                 <div className="tp-blog-title-box">
                                    <Link className="tp-blog-title-sm" href={`/blog/${item.slug}`}>{item.title}</Link>
                                 </div>
                                 <div className="tp-blog-author-info-box d-flex align-items-center">
                                    <div className="tp-blog-avata">
                                       <Image src={item.avata_img} alt={item.name} width={50} height={50} />
                                    </div>
                                    <div className="tp-blog-author-info">
                                       <h5>{item.name}</h5>
                                       <span>{item.job_title}</span>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                        )
                     } 

                  </div>
               </div>
            </div>
        </>
    );
};

export default Portfolio;
