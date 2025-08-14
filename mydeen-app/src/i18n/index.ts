import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
	en: {
		translation: {
			hello: 'Hello',
			appName: 'MyDeen',
			home: 'Home',
		},
	},
	ar: {
		translation: {
			hello: 'مرحبا',
			appName: 'ماي دين',
			home: 'الرئيسية',
		},
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: 'en',
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
});

export default i18n;