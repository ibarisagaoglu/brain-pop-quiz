import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = 'settings_language';
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [languageLoaded, setLanguageLoaded] = useState(false);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const value = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (value) setCurrentLanguage(value);
      } catch (error) {
        console.log('Failed to load language');
      } finally {
        setLanguageLoaded(true);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (languageCode) => {
    setCurrentLanguage(languageCode);
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, languageCode);
    } catch (error) {
      console.log('Failed to save language');
    }
  };

  const value = useMemo(() => ({ currentLanguage, setLanguage, languageLoaded }), [currentLanguage, languageLoaded]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error('useLanguage must be used within LanguageProvider');
  return value;
}
