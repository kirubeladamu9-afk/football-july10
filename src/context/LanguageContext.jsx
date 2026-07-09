import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('am');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load language from localStorage on mount
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('site-language');
      if (stored && ['am', 'en'].includes(stored)) {
        setLanguageState(stored);
      }
      // Also set html lang attribute
      document.documentElement.lang = stored || 'am';
      setIsLoading(false);
    }
  }, []);

  const setLanguage = (lang) => {
    if (['am', 'en'].includes(lang)) {
      setLanguageState(lang);
      localStorage.setItem('site-language', lang);
      document.documentElement.lang = lang;
    }
  };

  const value = {
    language,
    setLanguage,
    isLoading,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
