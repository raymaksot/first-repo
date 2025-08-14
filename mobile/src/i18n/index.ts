import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {} },
  ar: { translation: {} },
};

let initialized = false;

export function ensureI18n() {
  if (initialized) return i18n;
  i18n.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources,
    interpolation: { escapeValue: false },
  });
  initialized = true;
  return i18n;
}

export function setLanguage(lang: string) {
  ensureI18n();
  return i18n.changeLanguage(lang);
}

export default i18n;