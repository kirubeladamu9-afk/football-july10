import Image from 'next/image';
import {gsap} from 'gsap';
import Link from 'next/link';
import Offcanvus from '@/src/common/offcanvus';
import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
import NavMenu from './nav-menu';
import useSticky from '@/src/hooks/use-sticky';
import { useLanguage } from '@/src/hooks/useLanguage';

import logo from "../../../public/assets/img/logo/football-logo.webp"

const Header = () => {
      const {sticky}  =  useSticky()
      const { language, setLanguage, t } = useLanguage()
      const [sidebarOpen, setSidebarOpen] = useState(false)
      const [langDropdownOpen, setLangDropdownOpen] = useState(false)

      // gsa use
      let g_timline = new gsap.timeline();
      let header_top_animation = useRef(null)

      useEffect(() => {
         gsap.from(header_top_animation,  {
            opacity: 0,
		      y: '20px',
            delay: 1.05
         });
         gsap.to(header_top_animation, {
            opacity:1,
            y: '0px',
            delay: 1.05
        })
      },[])
 

    return (
        <>
         <header className="header-bottom__transparent z-index-6 tp-header-height">

               <div id="header-sticky" className={`header-bottom__area header-mob-space header-bottom__area-2 header-bottom__transparent z-index-5 ${sticky && "header-sticky"}`}>
                  <div className="container">
                     <div className="row align-items-center">
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-4 col-6">
                           <div className="header-bottom__logo">
                              <Link href="/"><Image  src={logo} alt="" width={180} height={50} /></Link>
                           </div>
                        </div>
                        <div className="col-xxl-8 col-xl-8 col-lg-8 d-none d-lg-flex justify-content-center">
                           <div className="header-bottom__main-menu">
                              <nav id="mobile-menu">
                              <NavMenu />
                              </nav>
                           </div>
                        </div>
                        <div className="col-xxl-2 col-xl-2 col-lg-2 col-md-8 col-6">
                           <div className="header-bottom__right d-flex align-items-center justify-content-end">
                              <div className="header-bottom__action">
                                 <div className="language-selector-wrapper d-none d-lg-inline-block">
                                    <button
                                       className="language-selector-btn"
                                       onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                                    >
                                       <i className="fal fa-globe"></i>
                                       <span>{t?.header?.language}</span>
                                    </button>
                                    {langDropdownOpen && (
                                       <div className="language-dropdown">
                                          <button
                                             className={`language-option ${language === 'am' ? 'active' : ''}`}
                                             onClick={() => {
                                                setLanguage('am')
                                                setLangDropdownOpen(false)
                                             }}
                                          >
                                             {t?.header?.amharic}
                                          </button>
                                          <button
                                             className={`language-option ${language === 'en' ? 'active' : ''}`}
                                             onClick={() => {
                                                setLanguage('en')
                                                setLangDropdownOpen(false)
                                             }}
                                          >
                                             {t?.header?.english}
                                          </button>
                                       </div>
                                    )}
                                 </div>
                              </div>
                              <div className="header-bottom__btn d-flex align-items-center">
                                 <Link className="tp-btn-white tp-btn-hover alt-color-black d-none d-md-inline-block" href="/service-details">
                        <span className="white-text">{t?.header?.register}</span>
                                    <b></b>
                                 </Link>
                                 <a className="header-bottom__bar d-lg-none tp-menu-bar" onClick={() => setSidebarOpen(true)}><i className="fal fa-bars"></i></a>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
         </header>
         <Offcanvus sidebarOpen={sidebarOpen}  setSidebarOpen={setSidebarOpen} />
        </>
    );
};

export default Header;
