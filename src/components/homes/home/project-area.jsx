import PlayIcon from '@/src/svg/play-icon';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useLanguage } from '@/src/hooks/useLanguage';

const setting = {
   loop: true,
   slidesPerView: 3,
   centeredSlides: true,
   spaceBetween: 30,
   breakpoints: {
      '1200': {
         slidesPerView: 3,
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

   scrollbar: {
      el: ".tp-scrollbar",
      clickable: true,
   },
}

const ProjectArea = () => {
   const { t, language } = useLanguage();
   const [isDragged, setIsDragged] = useState(false);
   const [multimedia, setMultimedia] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      fetchMultimedia();
   }, []);

   const fetchMultimedia = async () => {
      try {
         const response = await fetch('/api/multimedia/public');
         const data = await response.json();
         setMultimedia(data.multimedia || []);
      } catch (error) {
         console.error('Failed to fetch multimedia:', error);
      } finally {
         setLoading(false);
      }
   };

   const handleSlideChange = () => {
      setIsDragged(true);
   };

   const handleTransitionEnd = () => {
      setIsDragged(false);
   };

   const getTitle = (item) => language === 'en' ? item.titleEn : item.titleAm;
   const getDescription = (item) => language === 'en' ? item.descriptionEn : item.descriptionAm;
   const getDurationText = (item) => {
      if (!item.duration) return '';
      const minutes = Math.floor(item.duration / 60);
      return language === 'en' ? `${minutes} min` : `${minutes} ደቂቃ`;
   };

   return (
      <>
         <div className="tp-project__area grey-bg pt-50 pb-110 fix">
            <div className="container">
               <div className="row">
                  <div className="col-xl-6">
                     <div className="tp-project__section-box wow tpfadeLeft" data-wow-duration=".9s" data-wow-delay=".3s">
                        <h3 className="tp-section-title">{t.insights.podcastTitle}</h3>
                     </div>
                  </div>
               </div>
            </div>
            <div className="container-fluid gx-0">
               <div className="row gx-0">
                  <div className="col-xl-12">
                     <div className="tp-project__slider-section">
                        {loading ? (
                           <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>
                        ) : multimedia.length > 0 ? (
                           <Swiper
                              {...setting}
                              onSliderMove={handleSlideChange}
                              onTransitionEnd={handleTransitionEnd}
                              modules={[Navigation, Scrollbar]}
                              className={`swiper-container tp-project__slider-active ${isDragged ? "dragged" : ""
                                 }`}>
                              {multimedia.map((item, i) =>
                                 <SwiperSlide
                                    key={item.id}
                                    className="swiper-slide wow tpfadeUp"
                                    data-wow-duration=".9s"
                                    data-wow-delay={`${0.3 + (i * 0.2)}s`}
                                 >
                                    <div className="tp-project__slider-wrapper">
                                       <div className="tp-project__item d-flex align-items-center">
                                          <div className="tp-project__thumb">
                                             {item.thumbnailUrl && (
                                                <Image
                                                   src={item.thumbnailUrl}
                                                   alt={getTitle(item)}
                                                   width={298}
                                                   height={444}
                                                />
                                             )}
                                          </div>
                                          <div className="tp-project__content">
                                             <div className="tp-project__title-box">
                                                <h4 className="tp-project__title-sm">
                                                   <Link href="/">{getTitle(item)}</Link>
                                                </h4>
                                                <p>{getDescription(item)}</p>
                                             </div>
                                             <div className="tp-project__meta d-flex align-items-center">
                                                <div className="tp-project__author-info">
                                                   <span>{t.insights.episodeLabel}</span>
                                                   <h4>{item.chapter || '-'}</h4>
                                                </div>
                                                <div className="tp-project__budget">
                                                   <span>{t.insights.durationLabel}</span>
                                                   <h4>{getDurationText(item)}</h4>
                                                </div>
                                                <div className="tp-project__link">
                                                   {item.fileUrl && (
                                                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                                                         <PlayIcon />
                                                      </a>
                                                   )}
                                                </div>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </SwiperSlide>
                              )}
                           </Swiper>
                        ) : (
                           <div style={{ padding: '40px', textAlign: 'center' }}>No episodes available</div>
                        )}
                        <div className="tp-scrollbar"></div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ProjectArea;
