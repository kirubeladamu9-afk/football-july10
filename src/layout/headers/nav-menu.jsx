import Link from "next/link";
import React, { useContext } from "react";
import menu_data from "./menu-data";
import { LanguageContext } from "@/src/context/LanguageContext";
import translations from "@/src/i18n/translations";

const NavMenu = () => {
  const context = useContext(LanguageContext);
  const language = context?.language || 'am';
  const t = translations[language] || translations['am'];

  return (
    <>
      <ul>
        {menu_data.map((menu_item, i) => (
          <li key={i}>
            <Link href={menu_item.link}>{menu_item.title(t)}</Link>
            {menu_item.has_dropdown && (
              <ul className="submenu">
                {menu_item.sub_menus.map((sub_menu, i) => (
                  <li key={i}>
                    <Link href={sub_menu.link}>{sub_menu.title(t)}</Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

export default NavMenu;
