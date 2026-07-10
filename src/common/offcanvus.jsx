import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/src/hooks/useLanguage';
import MobileMenus from '../layout/headers/mobile-menus';

// images import
import logo from "../../public/assets/img/logo/footer-logo.webp"
import canvus_img_1 from "../../public/assets/img/logo/community-icon.webp"
import canvus_img_2 from "../../public/assets/img/logo/government-icon.webp";
import canvus_img_3 from "../../public/assets/img/logo/football-icon.webp";
import canvus_img_4 from "../../public/assets/img/logo/legal-icon.webp";

const Offcanvus = ({sidebarOpen, setSidebarOpen}) => {
    const { language, setLanguage, t } = useLanguage();
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);
    return (
        <>
            <div className="tpoffcanvas-area">
                <div className={`tpoffcanvas ${sidebarOpen && "opened"}`}>
                    <div className="tpoffcanvas__close-btn">
                    <button className="close-btn" onClick={() => setSidebarOpen(false)}><i className="fal fa-times"></i></button>
                    </div>
                    <div className="tpoffcanvas__logo text-center">
                    <Link href="/" onClick={() => setSidebarOpen(false)}>
                        <Image src={logo} alt="theme-pure" width={180} height={50} />
                    </Link>
                    </div>
                    <div className="mobile-menu mean-container">
                        <MobileMenus />
                    </div>
                    <div className="tpoffcanvas__language-selector">
                        <button
                            className="offcanvas-lang-toggle"
                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        >
                            <i className="fal fa-globe"></i>
                            <span>{t?.header?.language}</span>
                        </button>
                        {langDropdownOpen && (
                            <div className="offcanvas-lang-dropdown">
                                <button
                                    className={`offcanvas-lang-option ${language === 'am' ? 'active' : ''}`}
                                    onClick={() => {
                                        setLanguage('am');
                                        setLangDropdownOpen(false);
                                    }}
                                >
                                    {t?.header?.amharic}
                                </button>
                                <button
                                    className={`offcanvas-lang-option ${language === 'en' ? 'active' : ''}`}
                                    onClick={() => {
                                        setLanguage('en');
                                        setLangDropdownOpen(false);
                                    }}
                                >
                                    {t?.header?.english}
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="tpoffcanvas__instagram text-center">
                    <div className="tpoffcanvas__instagram-title">
                        <h4>instagram</h4>
                    </div>  
                    <Link href="#"><Image src={canvus_img_1}  alt="theme-pure" /></Link>
                    <Link href="#"><Image src={canvus_img_2}  alt="theme-pure" /></Link>
                    <Link href="#"><Image src={canvus_img_3}  alt="theme-pure" /></Link>
                    <Link href="#"><Image src={canvus_img_4}  alt="theme-pure" /></Link>
                    </div>
                    <div className="tpoffcanvas__info text-center">
                    <h4 className="offcanva-title">we are here</h4>
                    <Link href="https://www.google.com/maps/@23.506657,90.3443647,7z" target="_blank">
                        27 Division St, New York, <br />
                        NY 10002, USA
                    </Link>
                    </div>
                    <div className="tpoffcanvas__social">
                    <div className="social-icon text-center">
                        <Link href="#"><i className="fab fa-twitter"></i></Link>
                        <Link href="#"><i className="fab fa-instagram"></i></Link>
                        <Link href="#"><i className="fab fa-facebook-square"></i></Link>
                        <Link href="#"><i className="fab fa-dribbble"></i></Link>
                    </div>
                    </div>
                </div>
            </div>
            <div className={`body-overlay ${sidebarOpen &&  "apply"}`} onClick={() => setSidebarOpen(false)}></div>
        </>
    );
};

export default Offcanvus;
