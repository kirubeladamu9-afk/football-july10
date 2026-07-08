const menu_data = [
  {
    id: 1,
    mega_menu: false,
    has_dropdown: false,
    title: "መነሻ", // Home
    link: "/",
    active: "active",
  },
  {
    id: 2,
    mega_menu: true, // ረዘም ያሉ ዘርፎችን በግልጽ ለማሳየት Mega Menu ወይም Dropdown መጠቀም ይቻላል
    has_dropdown: true,
    title: "የይዘት ምሰሶዎች", // Content Pillars
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: "ፖለቲካ እና ስልጣን (Politics & Power)" },
      { link: "/", title: "ህግ እና አስተዳደር (Law & Governance)" },
      { link: "/", title: "ማህበረሰብ እና ክለቦች (Socio-Political)" },
    ],
  },
  {
    id: 3,
    mega_menu: false,
    has_dropdown: true,
    title: "የምርምር ማዕከል", // Research Hub
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: "ጥናታዊ ምሳሌዎች (Case Studies)" },
      { link: "/", title: "ጥልቅ የህግ ጥናቶች" },
      { link: "/", title: "የምርምር ወረቀቶች" },
    ],
  },
  {
    id: 4,
    mega_menu: false,
    has_dropdown: true,
    title: "መልቲሚዲያ", // Multimedia
    link: "/multimedia",
    active: "",
    sub_menus: [
      { link: "/", title: "ፖድካስቶች" },
      { link: "/", title: "የመረጃ እይታ (Infographics)" },
      { link: "/", title: "የቪዲዮ ትንተናዎች" },
    ],
  },
  {
    id: 5,
    mega_menu: false,
    has_dropdown: true,
    title: "ስለ እኛ", // About / Pages
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: "ስለ ፕሮጀክቱ" },
      { link: "/", title: "የምርምር ቡድን" },
      { link: "/", title: "ግንኙነት (Contact)" },
    ],
  },
];

export default menu_data;