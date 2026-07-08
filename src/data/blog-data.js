import img_1 from "../../public/assets/img/blog/blog-1.jpg"
import img_2 from "../../public/assets/img/blog/blog-2.jpg"
import img_3 from "../../public/assets/img/blog/blog-3.jpg"

import author_img_1 from "../../public/assets/img/blog/blog-avata-1.png";
import author_img_2 from "../../public/assets/img/blog/blog-avata-2.png";
import author_img_3 from "../../public/assets/img/blog/blog-avata-3.png";

import img_4 from "../../public/assets/img/blog/blog-4-1.jpg"
import img_5 from "../../public/assets/img/blog/blog-4-2.jpg"

const blog_data = [
  // home 03 
  {
    id: 1,
    img: img_1,
    category: "ስልታዊ ትንተና",
    color: "1",
    date: "ግንቦት 12, 2015",
    title: <>ዘመናዊ እግር ኳስን የቀየሩ አሰልጣኞች ስልት</>,
    author_img: author_img_1,
    author_name: "ሄኖክ ተስፋዬ",
    job_title: "ዋና አዘጋጅ እና ተንታኝ"
  },
  {
    id: 2,
    img: img_2,
    category: "የተጫዋቾች ዝውውር",
    color: "2",
    date: "ግንቦት 15, 2015",
    title: <>የዘንድሮው የክረምት ዝውውር ገበያ እና የሚጠበቁ ክስተቶች</>,
    author_img: author_img_2,
    author_name: "ዮናስ ታደሰ",
    job_title: "የስፖርት ጋዜጠኛ"
  },
  {
    id: 3,
    img: img_3,
    category: "የክለቦች ታሪክ",
    color: "3",
    date: "ግንቦት 18, 2015",
    title: <>የአፍሪካ እግር ኳስ እና የክለቦች ተሳትፎ</>,
    author_img: author_img_3,
    author_name: "ሃዩ",
    job_title: "የፖድካስት አዘጋጅ"
  },

  // home 04
  {
    id: 4,
    img: img_4,
    category: "ብሎግ",
    color: "",
    date: "10 ደቂቃ",
    title: <>ከሜዳ ውጪ ያሉ የጨዋታው እውነታዎች</>,
    description: <>የእግር ኳስ ተጫዋቾች ከሜዳ ውጪ የሚያሳልፉት ህይወት እና በተደጋጋሚ የሚያጋጥሟቸው የስነ-ልቦና ጫናዎች።</>,
    author_img: author_img_3,
    author_name: "ሃዩ",
    job_title: "የፖድካስት አዘጋጅ"
  },
  {
    id: 5,
    img: img_5,
    category: "ብሎግ",
    color: "",
    date: "24 ደቂቃ",
    title: <>የደጋፊዎች ጫና እና የዳኞች ውሳኔ</>,
    description: <>በደርቢ ጨዋታዎች ወቅት የደጋፊዎች ከፍተኛ ድምፅ እና ስሜት በዳኞች ውሳኔ አሰጣጥ ላይ የሚያሳድረው ቀጥተኛ ተፅዕኖ።</>,
    author_img: author_img_3,
    author_name: "ሃዩ",
    job_title: "የፖድካስት አዘጋጅ"
  },

  // anything here

]
export default blog_data