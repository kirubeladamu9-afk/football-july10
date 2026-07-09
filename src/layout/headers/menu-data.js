const menu_data = [
  {
    id: 1,
    mega_menu: false,
    has_dropdown: false,
    title: (t) => t.nav.home,
    link: "/",
    active: "active",
  },
  {
    id: 2,
    mega_menu: true,
    has_dropdown: true,
    title: (t) => t.nav.contentPillars,
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: (t) => t.nav.politics },
      { link: "/", title: (t) => t.nav.law },
      { link: "/", title: (t) => t.nav.sociopolitical },
    ],
  },
  {
    id: 3,
    mega_menu: false,
    has_dropdown: true,
    title: (t) => t.nav.researchHub,
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: (t) => t.nav.caseStudies },
      { link: "/", title: (t) => t.nav.legalStudies },
      { link: "/", title: (t) => t.nav.researchPapers },
    ],
  },
  {
    id: 4,
    mega_menu: false,
    has_dropdown: true,
    title: (t) => t.nav.multimedia,
    link: "/multimedia",
    active: "",
    sub_menus: [
      { link: "/", title: (t) => t.nav.podcasts },
      { link: "/", title: (t) => t.nav.infographics },
      { link: "/", title: (t) => t.nav.videoAnalysis },
    ],
  },
  {
    id: 5,
    mega_menu: false,
    has_dropdown: true,
    title: (t) => t.nav.about,
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: (t) => t.nav.aboutProject },
      { link: "/", title: (t) => t.nav.researchTeam },
      { link: "/contact", title: (t) => t.nav.contact },
    ],
  },
];

export default menu_data;
