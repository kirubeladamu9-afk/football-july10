const menu_data = [
  {
    id: 1,
    mega_menu: false,
    has_dropdown: true,
    title: "መነሻ",
    link: "/",
    active: "active",
  },
  {
    id: 2,
    mega_menu: false,
    has_dropdown: true,
    title: "የይዘት ምሰሶዎች",
    link: "/",
    active: "",
    sub_menus: [
      { link: "/", title: "ፖለቲካ እና ስልጣን" },
      { link: "/", title: "ህግ እና አስተዳደር" },
      { link: "/", title: "ማህበረሰብ እና ክለቦች" },
    ],
  },
  
  {
    id: 3,
    mega_menu: false,
    has_dropdown: true,
    title: "Projects",
    link: "/project",
    active: "",
    sub_menus: [
      { link: "/project", title: "Project" },
      { link: "/project-details", title: "Project Details" }, 
    ],
  },

  {
    id: 4,
    mega_menu: false,
    has_dropdown: true,
    title: "ጥናታዊ ፅሁፎች",
    link: "/",
    active: "",
  },
  
  {
    id: 5,
    mega_menu: false,
    has_dropdown: false,
    title: "መልቲሚዲያ",
    link: "/",
    active: "",
  },
  

];
export default menu_data;
