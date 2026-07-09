import { gsap } from 'gsap';
import Link from 'next/link';
import Image from 'next/image';
import React, { useState } from 'react';
import SocialLinks from '@/src/common/social-links';
import ContactIcon from '@/src/svg/contact-icon';
import EmailIcon from '@/src/svg/email';
import LocationIcon from '@/src/svg/location-icon';
import PhoneIcon from '@/src/svg/phone-icon';
import RightArrow from '@/src/svg/right-arrow';
import { useLanguage } from '@/src/hooks/useLanguage';

import footer_logo from "../../../public/assets/img/logo/footer-logo.webp";
import { useIsomorphicLayoutEffect } from '@/src/hooks/useIsomorphicEffect';


const Footer = () => {
  const { t, language, setLanguage } = useLanguage();
  const [isOppen, setIsOppen] = useState(false)

  const oppenLan = () => {
    setIsOppen(!isOppen)
  }

  const footer_content = {
    title: t.footer.newsTitle,
    description: t.footer.newsDescription,
    phone: t.footer.phone,
    contact_mail: "contact@info.com",
    location: t.footer.location,
    copy_right: t.footer.copyright,
    footer_lisks: [
      {
        id: 1,
        cls_1: "col-xl-3 col-lg-3 col-md-5",
        cls_2: "footer-col-2",
        title: t.footer.ourServices,
        delay: ".7s",
        links: [
          { name: t.footer.podcasts, link: "#" },
          { name: t.footer.strategicAnalysis, link: "#" },
          { name: t.footer.liveStreaming, link: "#" },
          { name: t.footer.sportAdvertising, link: "#" },
          { name: t.footer.clubHistory, link: "#" },
          { name: t.footer.youthTraining, link: "#" },
        ]
      },
      {
        id: 2,
        cls_1: "col-xl-2 col-lg-2 col-md-6",
        cls_2: "footer-col-3",
        title: t.footer.otherPages,
        delay: ".9s",
        links: [
          { name: t.footer.about, link: "/about" },
          { name: t.footer.services, link: "/service" },
          { name: t.footer.howItWorks, link: "#" },
          { name: t.footer.pricingPlans, link: "/price" },
          { name: t.footer.blog, link: "/blog" },
          { name: t.footer.contact, link: "/contact" },
        ]
      },
    ],
  }

  const { title, description, phone, contact_mail, location, copy_right, footer_lisks } = footer_content

  useIsomorphicLayoutEffect(() => {
    gsap.set(".tp-gsap-bg", { scaleX: 1 });
    let mm = gsap.matchMedia();
    mm.add("(min-width:1400px)", () => {
      gsap.to(".tp-gsap-bg", {
        scrollTrigger: {
          trigger: ".tp-gsap-bg",
          scrub: 0.02,
          start: "top bottom",
          end: "bottom bottom",
        },
        scaleX: .95,
        borderRadius: "30px",
        transformOrigin: "center center",
        ease: "none",
      });
    })
  }, []);


  return (
    <>
      <footer className="pb-50 fix">
        <div className="tp-footer__pl-pr p-relative">
          <div className="footer-black-bg tp-gsap-bg"></div>
          <div className="tp-footer__area pt-50">
            <div className="container">

              <div className="tp-footer__border-bottom">
                <div className="row align-items-center">
                  <div className="col-md-6 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".3s">
                    <div className="tp-footer__top-text">
                      <span>{title}</span>
                    </div>
                  </div>
                  <div className="col-md-6 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".5s">
                    <div className="tp-footer__input p-relative">
                      <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" placeholder={t.footer.emailPlaceholder} />
                        <span>
                          <EmailIcon />
                        </span>
                        <button>
                          <RightArrow />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="tp-footer__top-space">
                <div className="row">

                  <div className="col-xl-4 col-lg-4 col-md-7 pb-30 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".5s">
                    <div className="tp-footer__widget footer-col-1">
                      <Link href="/" className="tp-footer__widget-logo mb-10">
                        <Image src={footer_logo} alt="" width={280} height={50} />
                      </Link>
                      <div className="tp-footer__text">
                        <p>{description}</p>
                      </div>
                      <div className="tp-footer__social">
                        <SocialLinks />
                      </div>
                    </div>
                  </div>


                  {footer_lisks.map((item, i) =>
                    <div key={i} className={`${item.cls_1} pb-30 wow tpfadeUp`} data-wow-duration=".9s" data-wow-delay={item.delay}>
                      <div className={`tp-footer__widget ${item.cls_2}`}>
                        <h4 className="tp-footer__widget-title">{item.title}</h4>
                        <div className="tp-footer__content">
                          <ul>
                            {item.links.map((link, i) => <li key={i}><Link href={link.link}>{link.name}</Link></li>)}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="col-xl-3 col-lg-3 col-md-6 pb-30 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay="1s">
                    <div className="tp-footer__widget footer-col-4">
                      <h4 className="tp-footer__widget-title">{t.footer.contact}</h4>
                      <div className="tp-footer__contact-info tp-footer__icon-space">
                        <ul>
                          <li>
                            <span>
                              <PhoneIcon />
                            </span>
                            <Link href={`tel:${phone}`}>{phone}</Link>
                          </li>
                          <li>
                            <span>
                              <ContactIcon />
                            </span>
                            <Link href={`mailto:${contact_mail}`}>{contact_mail}</Link>
                          </li>
                          <li>
                            <span>
                              <LocationIcon />
                            </span>
                            <Link href="https://www.google.com/maps/@41.6758525,-86.2531698,18.17z"
                              target="_blank">{location}</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tp-copyright__area pt-20 pb-20">
            <div className="container">
              <div className="row align-items-center">
                <div className="col-md-6 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".7s">
                  <div className="tp-copyright__text">
                    <span>{copy_right} </span>
                  </div>
                </div>
                <div className="col-md-6 wow tpfadeUp" data-wow-duration=".9s" data-wow-delay=".9s">
                  <div className="tp-copyright__lang-box  d-flex align-items-center justify-content-md-end justify-content-start">
                    <div className="tp-copyright__lang">
                      <ul>
                        <li>
                          <button id="tp-copyright__lang-toggle" onClick={() => oppenLan()} >
                            <span>{t.footer.language}<i className="fal fa-angle-down"></i></span>
                          </button>

                          {isOppen &&
                            <ul className={`tp-copyright__lang-submenu ${isOppen && "open"}`}>
                              <li>
                                <button onClick={() => { setLanguage('am'); setIsOppen(false); }} style={{ background: 'none', border: 'none', color: language === 'am' ? '#0066cc' : 'inherit', cursor: 'pointer', padding: '0', textDecoration: 'none' }}>
                                  {t?.header?.amharic}
                                </button>
                              </li>
                              <li>
                                <button onClick={() => { setLanguage('en'); setIsOppen(false); }} style={{ background: 'none', border: 'none', color: language === 'en' ? '#0066cc' : 'inherit', cursor: 'pointer', padding: '0', textDecoration: 'none' }}>
                                  {t?.header?.english}
                                </button>
                              </li>
                            </ul>
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
