import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enTranslations from '../locales/en.json';
import myTranslations from '../locales/my.json';
import jaTranslations from '../locales/ja.json';

const resources = {
  en: {
    translation: enTranslations,
  },
  my: {
    translation: myTranslations,
  },
  ja: {
    translation: jaTranslations,
  },
};

// Only initialize on client side
if (typeof window !== 'undefined') {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      debug: process.env.NODE_ENV === 'development',
      
      interpolation: {
        escapeValue: false,
      },
      
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
      },
    });
} else {
  // Server-side initialization
  i18n
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      lng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
    });
}

export default i18n;
