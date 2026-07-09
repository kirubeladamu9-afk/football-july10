import { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '@/src/context/LanguageContext';
import translations from '@/src/i18n/translations';

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  const [isMounted, setIsMounted] = useState(false);

  // Track client-side mount to prevent hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fallback for SSR/build time when context is not available
  if (!context) {
    return {
      language: 'am',
      setLanguage: () => {},
      t: translations['am'],
      isLoaded: !isMounted, // Return true on server, false until mounted on client
      isMounted,
    };
  }

  const { language, setLanguage, isLoaded } = context;
  const t = translations[language];

  return {
    language,
    setLanguage,
    t,
    isLoaded: isLoaded || isMounted,
    isMounted,
  };
};
