import Link from "next/link";


const social_links = [
  {
    link: "https://www.facebook.com/share/1E9dUpMy8v/",
    target: "_blank",
    icon: "fab fa-facebook-f", 
  },
  {
    link: "https://x.com/NegeraHayu",
    target: "_blank",
    icon: "fab fa-x-twitter",
  },
  {
    link: "https://www.linkedin.com",
    target: "_blank",
    icon: "fab fa-linkedin-in", 
  }, 
  {
    link: "https://t.me",
    target: "_blank",
    icon: "fab fa-telegram-plane",
  },
  {
    link: "https://youtube.com/@hayumeda?si=JjRBaXotJQUvyTkl",
    target: "_blank",
    icon: "fab fa-youtube",
  },
];

const SocialLinks = () => {
  return (
    <>
      {social_links.map((l, i) => (
        <Link
          key={i}
          href={l.link}
          className={l.color}
          target={l.target ? l.target : ""}
        >
          <i className={l.icon}></i>
        </Link>
      ))}
    </>
  );
};

export default SocialLinks;






const copy_right_text = {
  copy_right: <>Full Copyright & Design By <Link href="#">@Theme pure</Link> – {new Date().getFullYear()}</>,
}
const {copy_right}  = copy_right_text

export const CopyRight = ()  => {
  return (
    <>
    {copy_right}
    </>
  )
}




// home 04 social link
const social_links_two = [
  {
    link: "http://facebook.com",
    target: "_blank",
    icon: "fab fa-facebook-f",
    color: "1", 
  },
  {
      link: "https://www.instagram.com",
      target: "_blank",
      icon: "fab fa-instagram", 
      color: "2",
  },

  {
    link: "https://x.com",
    target: "_blank",
    icon: "fab fa-x-twitter", 
    color: "3",
  },
  {
    link: "https://www.linkedin.com",
    target: "_blank",
    icon: "fab fa-linkedin-in",
    color: "4",
  },
  {
    link: "https://www.youtube.com",
    target: "_blank",
    icon: "fab fa-youtube",
    color: "5",
  },
];

export const  SocialLinksTwo = ()  => {
   return (
     <>
        {social_links_two.map((link, i) => (
          <Link
            key={i}
            target={link.target}
            className={`icon-color-${link.color}`}
            href={link.link}
          >
            <i className={link.icon}></i>
            <span></span>
          </Link>
        ))}
     </>
   );
}
