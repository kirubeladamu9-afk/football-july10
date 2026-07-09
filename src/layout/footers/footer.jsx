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
import { useLanguage } from '@/src/context/LanguageContext';

import footer_logo from "../../../public/assets/img/logo/footer-logo.webp";
import { useIsomorphicLayoutEffect } from '@/src/hooks/useIsomorphicEffect';

const Footer = () => {
  const { language, setLanguage } = useLanguage();
  const [isOppen, setIsOppen] = useState(false)

  const oppenLan = () => {
    setIsOppen(!isOppen)
  }

  const getFooterContent = () => {
    const year = new Date().getFullYear();
    if (language === 'am') {
      return {
        title: <>የቅርብ ጊዜ ዜናዎችን እና አዳዲስ መረጃዎችን ያግኙ</>,
        description: <>በእግር ኳስ ትንተና እና ስፖርታዊ መረጃዎች ላይ ያተኮረ የፖድካስት መድረክ።</>,
        phone: "+251(000)8899",
        contact_mail: "contact@info.com",
        location: "አዲስ አበባ፣ ኢትዮጵያ",
        copy_right: <>© {year} ከሜዳው ባሻገር። ሁሉም መብቶች የተጠበቁ ናቸው።</>,
        footer_links: [
          {
            id: 1,
            cls_1: "col-xl-3 col-lg-3 col-md-5",
            cls_2: "footer-col-2",
            title: "የምንሰራቸው ስራዎች",
            delay: ".7s",
            links: [
              { name: "ፖድካስት", link: "#" },
              { name: "ስልታዊ ትንተና", link: "#" },
              { name: "የቀጥታ ስርጭት", link: "#" },
              { name: "የስፖርት ማስታወቂያ", link: "#" },
              { name: "የክለቦች ታሪክ", link: "#" },
              { name: "የታዳጊዎች ስልጠና", link: "#" },
            ]
          },
          {
            id: 2,
            cls_1: "col-xl-2 col-lg-2 col-md-6",
            cls_2: "footer-col-3",
            title: "ሌሎች ገጾች",
            delay: ".9s",
            links: [
              { name: "ስለ እኛ", link: "/about" },
              { name: "አገልግሎቶች", link: "/service" },
              { name: "እንዴት ይሰራል", link: "#" },
              { name: "የክፍያ እቅድ", link: "/price" },
              { name: "ብሎግ", link: "/blog" },
              { name: "ያግኙን", link: "/contact" },
            ]
          },
        ],
      };
    } else {
      return {
        title: <>Get the Latest News and Information</>,
        description: <>A podcast platform focused on football analysis and sports information.</>,
        phone: "+251(000)8899",
        contact_mail: "contact@info.com",
        location: "Addis Ababa, Ethiopia",
        copy_right: <>© {year} Beyond The Pitch. All rights reserved.</>,
        footer_links: [
          {
            id: 1,
            cls_1: "col-xl-3 col-lg-3 col-md-5",
            cls_2: "footer-col-2",
            title: "What We Do",
            delay: ".7s",
            links: [
              { name: "Podcast", link: "#" },
              { name: "Strategic Analysis", link: "#" },
              { name: "Live Coverage", link: "#" },
              { name: "Sports News", link: "#" },
              { name: "Club History", link: "#" },
              { name: "Training Guides", link: "#" },
            ]
          },
          {
            id: 2,
            cls_1: "col-xl-2 col-lg-2 col-md-6",
            cls_2: "footer-col-3",
            title: "Other Pages",
            delay: ".9s",
            links: [
              { name: "About Us", link: "/about" },
              { name: "Services", link: "/service" },
              { name: "How It Works", link: "#" },
              { name: "Pricing Plan", link: "/price" },
              { name: "Blog", link: "/blog" },
              { name: "Contact Us", link: "/contact" },
            ]
          },
        ],
      };
    }
  };

  const footerContent = getFooterContent();
  const { title, description, phone, contact_mail, location, copy_right, footer_links } = footerContent;

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
                        <input type="text" placeholder={language === 'am' ? 'የስራ ኢሜይል አድራሻ' : 'Enter your email'} />
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


                  {footer_links.map((item, i) =>
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
                      <h4 className="tp-footer__widget-title">{language === 'am' ? 'ያግኙን' : 'Contact Us'}</h4>
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
                            <span>{language === 'am' ? 'አማርኛ (ET)' : 'English'}<i className="fal fa-angle-down"></i></span>
                          </button>

                          {isOppen &&
                            <ul className={`tp-copyright__lang-submenu ${isOppen && "open"}`}>
                              <li>
                                <button onClick={() => {
                                  setLanguage(language === 'am' ? 'en' : 'am');
                                  setIsOppen(false);
                                }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', textDecoration: 'none' }}>
                                  {language === 'am' ? 'English' : 'አማርኛ'}
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
