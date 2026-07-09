import { useContext } from 'react';
import { LanguageContext } from '@/src/context/LanguageContext';
import translations from '@/src/i18n/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  // Fallback for SSR/build time when context is not available
  if (!context) {
    return {
      language: 'am',
      setLanguage: () => {},
      t: translations['am'],
      isLoaded: true,
    };
  }

  const { language, setLanguage, isLoaded } = context;
  const t = translations[language];

  return {
    language,
    setLanguage,
    t,
    isLoaded,
  };
};
