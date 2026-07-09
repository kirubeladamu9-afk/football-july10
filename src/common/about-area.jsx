import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import { useLanguage } from '@/src/hooks/useLanguage';

// images import
import about_img_1 from "../../public/assets/img/about/about-bg-shape.png"
import about_img_2 from "../../public/assets/img/about/about-2.jpg"
import about_img_5 from "../../public/assets/img/about/about-5.png"

// about data
const about_data =[
    {
        id: 1,
        cls: "bg-shape",
        img: about_img_1
    },
    {
        id: 2,
        cls: "main-img z-index",
        img: about_img_2
    },
    {
        id: 5,
        cls: "sub-img-3 d-none d-sm-block z-index-3",
        img: about_img_5
    },
]

const AboutArea = () => {
    const { t } = useLanguage();

    const about_content = {
        title: t?.about?.founderTitle,
        sub_title: t?.about?.founderSubtitle,
        des: t?.about?.founderDesc,
        about_list: t?.about?.founderList || [],
        btn_text: t?.about?.learnMore,
    }

    const { title, sub_title, des, about_list, btn_text } = about_content;
    return (
        <>
            <div className="tp-about__area tp-about__pt-pb pt-100 pb-160">
               <div className="container">
                  <div className="row align-items-center">
                     <div className="col-xl-6 col-lg-6 wow tpfadeLeft" data-wow-duration=".9s" data-wow-delay=".2s">
                        <div className="tp-about__img-wrapper text-center text-lg-end p-relative">
                            {about_data.map((item, i) => 
                                <div key={i} className={`tp-about__${item.cls}`}>
                                    <Image src={item.img} alt="Hayu Project Vision" />
                                </div>
                            )} 
                        </div>
                     </div>
                     <div className="col-xl-6 col-lg-6 wow tpfadeRight" data-wow-duration=".9s" data-wow-delay=".6s">
                        <div className="tp-about__right">
                           <div className="tp-about__section-box">
                              <h4 className="tp-section-subtitle text-uppercase">{title}</h4>
                              <h3 className="tp-section-title mb-15">{sub_title}</h3>
                              <p>{des}</p>
                           </div>
                           <div className="tp-about__list">
                              <ul>
                                {about_list.map((item, i) => <li key={i}><i className="fal fa-check"></i>{item}</li>)}
                              </ul>
                           </div>
                           <div className="tp-about__btn">
                              <Link className="tp-btn tp-btn-hover alt-color-black" href="/">
                                 <span>{btn_text}</span>
                                 <b></b>
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
        </>
    );
};

export default AboutArea;
