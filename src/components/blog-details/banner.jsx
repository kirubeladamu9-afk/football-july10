import React from 'react';
import Image from 'next/image';
import { useLanguage } from '@/src/context/LanguageContext';
import brand_img from "../../../public/assets/img/blog/blog-details-1.jpg";

const Banner = ({ blog }) => {
    const { language } = useLanguage();
    const coverImage = blog?.coverImage || brand_img;
    const altText = language === 'am' ? (blog?.titleAm || blog?.titleEn || "Blog cover") : (blog?.titleEn || blog?.titleAm || "Blog cover");

    return (
        <>
           <div className="blog-details-img-area mb-80">
            <div className="container">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="blog-details-big-img z-index-2">
                        <Image src={coverImage} alt={altText} width={1200} height={600} onError={(e) => { e.currentTarget.src = brand_img; }} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </>
    );
};

export default Banner;
