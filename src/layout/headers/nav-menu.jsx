import Link from "next/link";
import React from "react";
import menu_data from "./menu-data";
import { useLanguage } from "@/src/hooks/useLanguage";

const NavMenu = () => {
  const { t } = useLanguage();

  return (
    <>
      <ul>
        {menu_data.map((menu_item, i) => (
          <li key={i}>
            <Link href={menu_item.link}>{menu_item.title(t)}</Link>
            {menu_item.has_dropdown && (
              <ul className="submenu">
                {menu_item.sub_menus.map((sub_menu, j) => (
                  <li key={j}>
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