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
    debug: false,
    backend: {
      loadPath: import.meta.env.DEV
        ? '/locales/{{lng}}/{{ns}}.json'
        : '/assets/unity_parent_app/new_frontend/locales/{{lng}}/{{ns}}.json',
    },
    ns: [
      'home',
      'login',
      'notice_listing',
      'navbar',
      'dashboard',
      'daily',
      'portion',
      'weekly',
      'weekly_listing',
      'daily_listing',
      'portion_listing',
      'early_pickup',
      'cmap_instructions',
      'early_instructions',
      'class_participation',
      'ptm_instruction',
      'absent',
      'create_absent',
      'fee',
      'online_ptm',
      'past_leave_note',
      'portion_card',
      'daily_card',
      'weekly_card',
      'fee_listing',
      'not_found',
      'timetable',
      'knowledge_base',
      'helpdesk',
      'student_profile',
      'offline_ptm',
      'otp_modal',
    ],
    defaultNS: 'home',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
