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

const ProjectArea = () => {
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
  return (
    <>
      <div className="tp-project__area grey-bg pt-50 pb-110 fix">

        <div className="container-fluid gx-0">
          <div className="row gx-0">
            <div className="col-xl-12">
              <div className="tp-project__slider-section">
                <Swiper
                  {...setting}
                  onSliderMove={handleSlideChange}
                  onTransitionEnd={handleTransitionEnd}
                  modules={[Navigation, Scrollbar]}
                  className={`swiper-container tp-project__slider-active ${isDragged ? "dragged" : ""
                    }`}>
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
                                alt={item.titleEn}
                                width="298"
                                height="444"
                              />
                            )}
                          </div>
                          <div className="tp-project__content">
                            <div className="tp-project__title-box">
                              <h4 className="tp-project__title-sm">{item.titleEn}</h4>
                              <p>{item.descriptionEn}</p>
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
