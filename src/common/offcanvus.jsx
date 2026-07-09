import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/src/hooks/useLanguage';
import MobileMenus from '../layout/headers/mobile-menus';

// images import
import logo from "../../public/assets/img/logo/football-logo.webp"
import canvus_img_1 from "../../public/assets/img/project/project-inner-4.jpg"
import canvus_img_2 from "../../public/assets/img/project/project-inner-5.jpg";
import canvus_img_3 from "../../public/assets/img/project/project-inner-6.jpg";
import canvus_img_4 from "../../public/assets/img/project/project-inner-7.jpg";

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
                    <div className="tpoffcanvas__language-selector" style={{ padding: '20px 0', textAlign: 'center', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', margin: '20px 0' }}>
                        <button
                            style={{ background: 'none', border: 'none', fontSize: '16px', fontWeight: '500', cursor: 'pointer', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '10px' }}
                            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        >
                            <i className="fal fa-globe"></i>
                            <span>{t?.header?.language}</span>
                        </button>
                        {langDropdownOpen && (
                            <div style={{ padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <button
                                    onClick={() => {
                                        setLanguage('am');
                                        setLangDropdownOpen(false);
                                    }}
                                    style={{ background: language === 'am' ? '#e8f0ff' : 'transparent', border: 'none', padding: '8px 10px', cursor: 'pointer', borderRadius: '4px', color: language === 'am' ? '#0066cc' : '#000', fontSize: '14px' }}
                                >
                                    {t?.header?.amharic}
                                </button>
                                <button
                                    onClick={() => {
                                        setLanguage('en');
                                        setLangDropdownOpen(false);
                                    }}
                                    style={{ background: language === 'en' ? '#e8f0ff' : 'transparent', border: 'none', padding: '8px 10px', cursor: 'pointer', borderRadius: '4px', color: language === 'en' ? '#0066cc' : '#000', fontSize: '14px' }}
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
