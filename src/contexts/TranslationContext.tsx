
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { locales, SupportedLanguage, TranslationKeys } from '@/locales';

interface TranslationContextType {
  currentLanguage: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: TranslationKeys;
  isRTL: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

const RTL_LANGUAGES = ['ar', 'ur', 'fa', 'he'];

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    // Try to get language from localStorage
    const savedLang = localStorage.getItem('preferred-language') as SupportedLanguage;
    if (savedLang && locales[savedLang]) {
      return savedLang;
    }
    
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    if (locales[browserLang]) {
      return browserLang;
    }
    
    // Default to English instead of Arabic
    return 'en';
  });

  const setLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language);
    
    // Update document direction
    const isRTL = RTL_LANGUAGES.includes(language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  useEffect(() => {
    // Set initial direction
    const isRTL = RTL_LANGUAGES.includes(currentLanguage);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const isRTL = RTL_LANGUAGES.includes(currentLanguage);
  const t = locales[currentLanguage];

  return (
    <TranslationContext.Provider value={{ currentLanguage, setLanguage, t, isRTL }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
