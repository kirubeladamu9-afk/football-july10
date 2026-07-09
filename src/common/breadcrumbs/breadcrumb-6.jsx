import React from 'react';
import Image from 'next/image';
import SocialLinks from '../social-links';
import { useLanguage } from '@/src/hooks/useLanguage';

import img_1 from "../../../public/assets/img/breadcrumb/breadcrumb-shape-1.png";
import img_2 from "../../../public/assets/img/breadcrumb/breadcrumb-shape-2.png";
import img_3 from "../../../public/assets/img/blog/blog-avata-1.png";

function pickLang(blog, baseField, language) {
    if (!blog) return '';
    const en = blog[`${baseField}En`];
    const am = blog[`${baseField}Am`];
    if (language === 'am') return am || en || '';
    return en || am || '';
}

const BreadcrumbSix = ({ blog }) => {
    const { language } = useLanguage();

    const sub_title = blog?.category || '';
    const title = pickLang(blog, 'title', language);
    const author_name = blog?.authorName || '';
    const author_avatar = blog?.authorAvatar || img_3;
    const author_role = pickLang(blog, 'authorRole', language);
    const publish_date = blog?.publishDate
        ? new Date(blog.publishDate).toLocaleDateString(language === 'am' ? 'am-ET' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
    const author_info = [author_role, publish_date].filter(Boolean).join(' • ');

    return (
        <>
            <div className="breadcrumb__area breadcrumb-ptb-4 p-relative blue-bg-2">
            <div className="breadcrumb__shape-1">
               <Image src={img_1} alt="theme-pure" />
            </div>
            <div className="breadcrumb__shape-2">
               <Image src={img_2} alt="theme-pure" />
            </div>
            <div className="container">
               <div className="row align-items-end">
                  <div className="col-xl-9 col-lg-9 col-md-9">
                     <div className="blog-details-banner z-index-2">
                        <div className="blog-details-title-box">
                           <span>{sub_title}</span>
                           <h3 className="blog-details-banner-title">{title}</h3>
                        </div>
                        <div className="tp-blog-author-info-box d-flex align-items-center">
                           <div className="tp-blog-avata">
                              <Image src={author_avatar} alt={author_name} width={60} height={60} onError={(e) => { e.currentTarget.src = img_3; }} />
                           </div>
                           <div className="tp-blog-author-info">
                              <h5>{author_name}</h5>
                              <span>{author_info}</span>
                           </div>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-3">
                     <div className="blog-details-social-box z-index-3 text-md-end text-start">
                        <SocialLinks />  
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </>
    );
};

export default BreadcrumbSix;