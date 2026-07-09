import Link from "next/link";
import React, { useState } from "react";
import { useLanguage } from "@/src/hooks/useLanguage";
import menu_data from "./menu-data";

const MobileMenus = () => {
  const { t } = useLanguage();
  const [navTitle, setNavTitle] = useState("");

  const openMobileMenu = (menu) => {
    if (navTitle === menu) {
      setNavTitle("");
    } else {
      setNavTitle(menu);
    }
  };
  return (
    <>
      <nav className="mean-nav">
        <ul>
          {menu_data.map((menu, i) => {
            const menuTitle = menu.title(t);
            return (
              <React.Fragment key={i}>
                {menu.has_dropdown && (
                  <li className="has-dropdown">
                    <Link href={menu.link}>{menuTitle}</Link>
                    <ul
                      className="submenu"
                      style={{
                        display: navTitle === menuTitle ? "block" : "none",
                      }}
                    >
                      {menu.sub_menus.map((sub, i) => (
                        <li key={i}>
                          <Link href={sub.link}>{sub.title(t)}</Link>
                        </li>
                      ))}
                    </ul>
                    <a
                      className={`mean-expand ${
                        navTitle === menuTitle ? "mean-clicked" : ""
                      }`}
                      onClick={() => openMobileMenu(menuTitle)}
                      style={{ fontSize: "18px", cursor: "pointer" }}
                    >
                      <i className="fal fa-plus"></i>
                    </a>
                  </li>
                )}
                {!menu.has_dropdown && (
                  <li>
                    <Link href={menu.link}>{menuTitle}</Link>
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      </nav>
    </>
  );
};

export default MobileMenus;
