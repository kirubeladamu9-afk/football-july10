import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useLanguage } from '@/src/hooks/useLanguage';

import shapes_2 from "../../../../public/assets/img/payment/mobile.png";
import shapes_3 from "../../../../public/assets/img/payment/hand.png";
import shapes_4 from "../../../../public/assets/img/payment/coin-1.png";
import shapes_5 from "../../../../public/assets/img/payment/coin-2.png";
import shapes_6 from "../../../../public/assets/img/payment/payment-3.png";
import payment_img_1 from "../../../../public/assets/img/payment/image.png";

const InsightsArea = () => {
  const { t } = useLanguage();

  const box_1 = [
    {
      id: 1,
      col: "md-6",
      cls: "2 tpfadeLeft",
      delay: ".3s",
      title: t.insights.box1Title,
      des: t.insights.box1Des,
      btn: t.insights.researchBtn,
      link: "/",
      shapes: [
        { id: 1, cls: "5", img: shapes_2 },
      ]
    },
    {
      id: 2,
      col: "md-6",
      cls: "3 tpfadeRight",
      delay: ".5s",
      title: t.insights.box2Title,
      des: t.insights.box2Des,
      btn: t.insights.researchBtn,
      link: "/",
      shapes: [
        { id: 1, cls: "9", img: shapes_6 },
      ]
    },
  ];

  return (
    <>
      <div id="insights-section" className="tp-payment__area pt-110 pb-110">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7">
              <div className="tp-payment__title-box text-center mb-55">
                <h3 className="tp-section-title-lg">{t.insights.title}</h3>
                <p>{t.insights.subtitle}</p>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">

            <div className="col-xl-12">
              <div className="row">
                {box_1.map((item, i) =>
                  <div key={i} className="col-md-6 mb-30">
                    <div className={`tp-payment__item tp-payment__bg-color-${item.cls} p-relative z-index wow `}
                      data-wow-duration=".9s"
                      data-wow-delay={item.delay}>
                      {item.shapes.map((shape, index) =>
                        <div key={index} className={`tp-payment__shape-${shape.cls}`}>
                          <Image src={shape.img} alt="research-shapes" />
                        </div>
                      )}

                      <div className="tp-payment__content">
                        <h3 className="tp-payment__title">{item.title}</h3>
                        <p> {item.des}</p>
                        {item.btn && item.link && (
                          <Link href={item.link} className="tp-btn-link">
                            {item.btn}<i className="far fa-arrow-right"></i>
                          </Link>
                        )}
                      </div>

                    </div>
                  </div>
                )
                }
              </div>
            </div>

            <div className="col-xl-12 mb-30">
              <div className="tp-payment__item p-relative z-index wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".7s">
                <div className="row">
                  <div className="col-md-6">
                    <div className="tp-payment__content tp-payment__content-space">
                      <h3 className="tp-payment__title">{t.insights.box3Title}</h3>
                      <p>{t.insights.box3Des}</p>
                      <Link href="/" className="tp-btn-link">{t.insights.researchBtn}<i className="far fa-arrow-right"></i></Link>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="tp-payment__shape-2">
                      <Image src={payment_img_1} alt="socio-political-analysis" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </>
  );
};

export default InsightsArea;
