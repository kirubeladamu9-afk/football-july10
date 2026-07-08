import RightArrow from '@/src/svg/right-arrow';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { Navigation, Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

// የውሂብ ምንጩን ወደ ፖድካስት ዳታ እንቀይራለን (You can rename your data file to podcast-data)
import podcast_data from '@/src/data/podcast-data';

const setting = {
  loop: true,
  slidesPerView: 3,
  centeredSlides: true,
  spaceBetween: 30,
  breakpoints: {
    '1200': { slidesPerView: 3 },
    '992': { slidesPerView: 1 },
    '768': { slidesPerView: 1 },
    '576': { slidesPerView: 1 },
    '0': { slidesPerView: 1 },
  },
  scrollbar: {
    el: ".tp-scrollbar",
    clickable: true,
  },
}

const PodcastArea = () => {
  const [isDragged, setIsDragged] = useState(false);

  const handleSlideChange = () => {
    setIsDragged(true);
  };

  const handleTransitionEnd = () => {
    setIsDragged(false);
  };

  return (
    <>
      <div className="tp-project__area grey-bg pt-50 pb-110 fix">
        <div className="container">
          <div className="row">
            <div className="col-xl-6">
              <div className="tp-project__section-box wow tpfadeLeft" data-wow-duration=".9s" data-wow-delay=".3s">
                <h3 className="tp-section-title">የቅርብ ጊዜ የፖድካስት ክፍሎች</h3>
              </div>
            </div>
          </div>
        </div>
        <div className="container-fluid gx-0">
          <div className="row gx-0">
            <div className="col-xl-12">
              <div className="tp-project__slider-section">
                <Swiper
                  {...setting}
                  onSliderMove={handleSlideChange}
                  onTransitionEnd={handleTransitionEnd}
                  modules={[Navigation, Scrollbar]}
                  className={`swiper-container tp-project__slider-active ${isDragged ? "dragged" : ""}`}>

                  {podcast_data.map((item, i) =>
                    <SwiperSlide
                      key={i}
                      className="swiper-slide wow tpfadeUp"
                      data-wow-duration=".9s"
                      data-wow-delay={item.delay}
                    >
                      <div className="tp-project__slider-wrapper">
                        <div className="tp-project__item d-flex align-items-center">
                          <div className="tp-project__thumb">
                            {/* የፖድካስቱ ከቨር ምስል (Cover Art) */}
                            <Image src={item.img_1} alt={item.title} width={300} height={300} />
                          </div>
                          <div className="tp-project__content">
                            <div className="tp-project__brand-icon">
                              {/* የኦዲዮ/ማይክሮፎን ምልክት ወይም የፕሌይ በተን አይኮን */}
                              <Image src={item.img_2} alt="play-icon" width={50} height={50} />
                            </div>
                            <div className="tp-project__title-box">
                              <h4 className="tp-project__title-sm">
                                <Link href={`/multimedia/podcasts/${item.id}`}>{item.title}</Link>
                              </h4>
                              <p>{item.description}</p>
                            </div>
                            <div className="tp-project__meta d-flex align-items-center">
                              <div className="tp-project__author-info">
                                <span>ክፍል (Episode)</span>
                                <h4>{item.episode_no}</h4>
                              </div>
                              <div className="tp-project__budget">
                                <span>ቆይታ (Duration)</span>
                                <h4>{item.duration} ሚኒት</h4>
                              </div>
                              <div className="tp-project__link">
                                <Link href={`/multimedia/podcasts/${item.id}`}>
                                  <RightArrow />
                                </Link>
                              </div>
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

export default PodcastArea;