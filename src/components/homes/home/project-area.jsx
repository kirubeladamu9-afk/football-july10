import RightArrow from '@/src/svg/right-arrow';
import { useLanguage } from '@/src/hooks/useLanguage';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

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

const formatDuration = (minutes) => {
  const totalMinutes = Number(minutes);
  if (!Number.isFinite(totalMinutes)) return '';

  if (totalMinutes < 1) {
    return `${Math.round(totalMinutes * 60)} Sec`;
  }

  if (totalMinutes < 60) {
    return `${totalMinutes} Min`;
  }

  const hours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const hourLabel = hours === 1 ? 'Hour' : 'Hours';

  if (remainingMinutes === 0) {
    return `${hours} ${hourLabel}`;
  }

  return `${hours} ${hourLabel} ${remainingMinutes} Min`;
};

const ProjectArea = () => {
  const { language } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [isDragged, setIsDragged] = useState(false);

  useEffect(() => {
    const fetchMultimedia = async () => {
      try {
        const response = await fetch('/api/multimedia/public');
        if (!response.ok) return;

        const { multimedia } = await response.json();
        setProjects(multimedia || []);
      } catch (error) {
        console.error('Error fetching multimedia:', error);
      }
    };

    fetchMultimedia();
  }, []);

  const handleSlideChange = () => {
    setIsDragged(true);
  };

  const handleTransitionEnd = () => {
    setIsDragged(false);
  };

  const hasMultipleProjects = projects.length > 1;
  const sliderSettings = hasMultipleProjects
    ? setting
    : {
        ...setting,
        loop: false,
        centeredSlides: false,
        slidesPerView: 1,
        breakpoints: {
          '1200': { slidesPerView: 1 },
          '992': { slidesPerView: 1 },
          '768': { slidesPerView: 1 },
          '576': { slidesPerView: 1 },
          '0': { slidesPerView: 1 },
        },
      };

  return (
    <>
      <div className="tp-project__area grey-bg pt-50 pb-110 fix">

        <div className="container-fluid gx-0">
          <div className="row gx-0">
            <div className="col-xl-12">
              <div className="tp-project__slider-section">
                <Swiper
                  {...sliderSettings}
                  onSliderMove={handleSlideChange}
                  onTransitionEnd={handleTransitionEnd}
                  modules={[Navigation, Scrollbar]}
                  className={`swiper-container tp-project__slider-active ${
                    hasMultipleProjects ? '' : 'tp-project__slider-active--single'
                  } ${isDragged ? 'dragged' : ''}`}>
                  {projects.map((item) =>
                    <SwiperSlide
                      key={item.id}
                      className="swiper-slide wow tpfadeUp"
                      data-wow-duration=".9s"
                    >
                      <div className="tp-project__slider-wrapper">
                        <div className="tp-project__item d-flex align-items-center">
                          <div className="tp-project__thumb">
                            {item.thumbnailUrl && (
                              <img
                                className="tp-project__featured-image"
                                src={item.thumbnailUrl}
                                alt={language === 'am' ? item.titleAm : item.titleEn}
                                width="298"
                                height="444"
                              />
                            )}
                          </div>
                          <div className="tp-project__content">
                            <div className="tp-project__brand-icon">
                              <img src="/assets/img/project/project-brand-multimedia.webp" alt="" />
                            </div>
                            <div className="tp-project__title-box">
                              <h4 className="tp-project__title-sm">
                                {language === 'am' ? item.titleAm || item.titleEn : item.titleEn || item.titleAm}
                              </h4>
                              <p>{language === 'am' ? item.descriptionAm || item.descriptionEn : item.descriptionEn || item.descriptionAm}</p>
                            </div>
                            <div className="tp-project__meta d-flex align-items-center">
                              {item.chapter && (
                                <div className="tp-project__author-info">
                                  <span>{language === 'am' ? 'ምዕራፍ' : 'Chapter'}</span>
                                  <h4>{item.chapter}</h4>
                                </div>
                              )}
                              {item.duration && (
                                <div className="tp-project__budget">
                                  <span>{language === 'am' ? 'ጊዜ' : 'Duration'}</span>
                                  <h4>{formatDuration(item.duration)}</h4>
                                </div>
                              )}
                              {item.fileUrl && (
                                <div className="tp-project__link">
                                  <Link href={item.fileUrl} target="_blank" rel="noreferrer" aria-label={language === 'am' ? 'ሚዲያ ክፈት' : 'Open media'}>
                                    <RightArrow />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  )}
                </Swiper>
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
