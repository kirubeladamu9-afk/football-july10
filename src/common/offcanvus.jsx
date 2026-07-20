import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import ImageWithLoader from '@/src/components/common/ImageWithLoader';
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
                        <ImageWithLoader src={logo} alt="offcanvas logo" width={180} height={50} />
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
                        <h4>All in one</h4>
                    </div>
                    <Link href="#"><ImageWithLoader src={canvus_img_1} alt="community icon" /></Link>
                    <Link href="#"><ImageWithLoader src={canvus_img_2} alt="government icon" /></Link>
                    <Link href="#"><ImageWithLoader src={canvus_img_3} alt="football icon" /></Link>
                    <Link href="#"><ImageWithLoader src={canvus_img_4} alt="legal icon" /></Link>
                    </div>
                    <div className="tpoffcanvas__info text-center">
                    <h4 className="offcanva-title">we are here</h4>
                    <Link href="https://www.google.com/maps/@23.506657,90.3443647,7z" target="_blank">
                        Addis Ababa, <br />
                        Ethiopia
                    </Link>
                    </div>
                    <div className="tpoffcanvas__social">
                    <div className="social-icon text-center">
                        <Link href="#"><i className="fab fa-x-twitter"></i></Link>
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
