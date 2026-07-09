import { createContext, useState, useEffect } from 'react';
import translations from '@/src/i18n/translations';

export const LanguageContext = createContext({
  language: 'am',
  setLanguage: () => { },
  t: translations.am,
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('am');
  const [hydrated, setHydrated] = useState(false);

  // On mount, read any saved preference. Defaults to 'am' if none exists.
  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? window.localStorage.getItem('site_language')
      : null;
    if (saved === 'en' || saved === 'am') {
      setLanguageState(saved);
    }
    setHydrated(true);
  }, []);

  // Keep <html lang="..."> in sync for accessibility/SEO
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'am') return;
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('site_language', lang);
    }
  }

  const t = translations[language] || translations.am;

  // Avoid a flash of wrong-language content before localStorage is read
  if (!hydrated) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}