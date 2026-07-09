import React, { createContext, useState, useEffect } from 'react';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState('am');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language preference from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('preferred_language');
      if (savedLanguage) {
        setLanguageState(savedLanguage);
      }
      setIsLoaded(true);
    }
  }, []);

  const setLanguage = (lang) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', lang);
    }
  };

  const value = {
    language,
    setLanguage,
    isLoaded,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
