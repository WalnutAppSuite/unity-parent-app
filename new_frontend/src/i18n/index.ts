import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng : "en",
    debug: true,
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    ns: ['home', 'login', 'notice_listing', 'navbar', 'dashboard', "daily", "portion", "weekly", "weekly_listing", "daily_listing", "portion_listing"],
    defaultNS: 'home',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;