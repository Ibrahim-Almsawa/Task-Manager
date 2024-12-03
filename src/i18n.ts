import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      'Edit': 'Edit',
      'Delete': 'Delete',
      'Overdue': 'Overdue',
      'high': 'High Priority',
      'medium': 'Medium Priority',
      'low': 'Low Priority',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
