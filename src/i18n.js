import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Task Manager": "Task Manager",
      "Organize your tasks efficiently": "Organize your tasks efficiently",
      "Your Tasks": "Your Tasks"
    }
  },
  ar: {
    translation: {
      "Task Manager": "مدير المهام",
      "Organize your tasks efficiently": "نظم مهامك بكفاءة",
      "Your Tasks": "مهامك"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
