import React from 'react';
import Image from 'next/image';
import brand_img from "../../../public/assets/img/blog/blog-details-1.jpg";


const Banner = ({ blog }) => {
    const coverImage = blog?.coverImage || brand_img;

    return (
        <>
           <div className="blog-details-img-area mb-80">
            <div className="container">
               <div className="row">
                  <div className="col-xl-12">
                     <div className="blog-details-big-img z-index-2">
                        <Image src={coverImage} alt={blog?.titleEn || "Blog cover"} width={1200} height={600} onError={(e) => { e.currentTarget.src = brand_img; }} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
        </>
    );
};

export default Banner;
