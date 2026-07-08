import { useState, useEffect } from 'react';

export function useLanguage(initialLang = 'en') {
  const [language, setLanguage] = useState(initialLang);

  useEffect(() => {
    const saved = localStorage.getItem('admin_language');
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  function switchLanguage(lang) {
    setLanguage(lang);
    localStorage.setItem('admin_language', lang);
  }

  return { language, switchLanguage };
}

export const translations = {
  dashboard: {
    en: 'Dashboard',
    am: 'ዳሽቦርድ',
  },
  blogs: {
    en: 'Blogs',
    am: 'ብሎግዎች',
  },
  multimedia: {
    en: 'Multimedia',
    am: 'ሙልቲሚዲያ',
  },
  settings: {
    en: 'Settings',
    am: 'ቅንብሮች',
  },
  logout: {
    en: 'Logout',
    am: 'ውጣ',
  },
  welcome: {
    en: 'Welcome back',
    am: 'እንደገና አሎ',
  },
  totalArticles: {
    en: 'Total Articles',
    am: 'ድምር ጹሑፎች',
  },
  published: {
    en: 'Published',
    am: 'ታተመ',
  },
  drafts: {
    en: 'Drafts',
    am: 'ረቂቅ',
  },
  totalMultimedia: {
    en: 'Total Multimedia',
    am: 'ድምር ሙልቲሚዲያ',
  },
  recentActivity: {
    en: 'Recent Activity',
    am: 'የቅርብ ጊዜ እንቅስቃሴ',
  },
  newBlog: {
    en: 'New Blog',
    am: 'አዲስ ብሎግ',
  },
  editBlog: {
    en: 'Edit Blog',
    am: 'ብሎግ አርትዖት',
  },
  deleteBlog: {
    en: 'Delete Blog',
    am: 'ብሎግ ሰርዝ',
  },
  title: {
    en: 'Title',
    am: 'ርዕስ',
  },
  english: {
    en: 'English',
    am: 'ሪድ',
  },
  amharic: {
    en: 'Amharic',
    am: 'አማርኛ',
  },
  content: {
    en: 'Content',
    am: 'ይዘት',
  },
  category: {
    en: 'Category',
    am: 'ምድብ',
  },
  tags: {
    en: 'Tags',
    am: 'ትግireet',
  },
  status: {
    en: 'Status',
    am: 'ሁኔታ',
  },
  publish: {
    en: 'Publish',
    am: 'ታተም',
  },
  save: {
    en: 'Save',
    am: 'አስቀምጥ',
  },
  cancel: {
    en: 'Cancel',
    am: 'ይቅር',
  },
  delete: {
    en: 'Delete',
    am: 'ሰርዝ',
  },
  loading: {
    en: 'Loading...',
    am: 'በመጫን ላይ...',
  },
  error: {
    en: 'An error occurred',
    am: 'ስህተት ተከስቷል',
  },
  success: {
    en: 'Success',
    am: 'ስኬት',
  },
  email: {
    en: 'Email',
    am: 'ኢሜይል',
  },
  password: {
    en: 'Password',
    am: 'ይለፍ ቃል',
  },
  signIn: {
    en: 'Sign In',
    am: 'ተግብር',
  },
  invalidCredentials: {
    en: 'Invalid email or password',
    am: 'ትክክለኛ ያልሆነ ኢሜይል ወይም ይለፍ ቃል',
  },
  politicsPower: {
    en: 'Politics & Power',
    am: 'ፖለቲካ እና ስልጣን',
  },
  lawGovernance: {
    en: 'Law & Governance',
    am: 'ህግ እና አስተዳደር',
  },
  societyEthics: {
    en: 'Society & Ethics',
    am: 'ማህበረሰብ እና ስነምግባር',
  },
  episode: {
    en: 'Episode',
    am: 'ክፍል',
  },
  duration: {
    en: 'Duration',
    am: 'ጊዜ ርዝመት',
  },
  type: {
    en: 'Type',
    am: 'አይነት',
  },
  audio: {
    en: 'Audio',
    am: 'ድምጽ',
  },
  video: {
    en: 'Video',
    am: 'ቪዲዮ',
  },
  fileUrl: {
    en: 'File URL',
    am: 'ፋይል URL',
  },
  siteSettings: {
    en: 'Site Settings',
    am: 'የሳይት ቅንብሮች',
  },
};

export function t(key, lang) {
  return translations[key]?.[lang] || key;
}
