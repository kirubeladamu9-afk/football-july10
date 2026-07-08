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
    link: "#pillars",
    active: "",
    sub_menus: [
      { link: "/pillars/politics-and-power", title: "ፖለቲካ እና ስልጣን (Politics & Power)" },
      { link: "/pillars/law-and-governance", title: "ህግ እና አስተዳደር (Law & Governance)" },
      { link: "/pillars/socio-political", title: "ማህበረሰብ እና ክለቦች (Socio-Political)" },
    ],
  },
  {
    id: 3,
    mega_menu: false,
    has_dropdown: true,
    title: "የምርምር ማዕከል", // Research Hub
    link: "/research",
    active: "",
    sub_menus: [
      { link: "/research/case-studies", title: "ጥናታዊ ምሳሌዎች (Case Studies)" },
      { link: "/research/legal-deep-dives", title: "ጥልቅ የህግ ጥናቶች" },
      { link: "/research/papers", title: "የምርምር ወረቀቶች" },
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
      { link: "/multimedia/podcasts", title: "ፖድካስቶች" },
      { link: "/multimedia/infographics", title: "የመረጃ እይታ (Infographics)" },
      { link: "/multimedia/videos", title: "የቪዲዮ ትንተናዎች" },
    ],
  },
  {
    id: 5,
    mega_menu: false,
    has_dropdown: true,
    title: "ስለ እኛ", // About / Pages
    link: "/about",
    active: "",
    sub_menus: [
      { link: "/about", title: "ስለ ፕሮጀክቱ" },
      { link: "/team", title: "የምርምር ቡድን" },
      { link: "/contact", title: "ግንኙነት (Contact)" },
    ],
  },
];

export default menu_data;