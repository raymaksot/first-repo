import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
	en: {
		translation: {
			hello: 'Hello',
			appName: 'MyDeen',
			home: 'Home',
			comments: 'Comments',
			events: 'Events',
			groups: 'Groups',
		},
	},
	ar: {
		translation: {
			hello: 'مرحبا',
			appName: 'ماي دين',
			home: 'الرئيسية',
			comments: 'التعليقات',
			events: 'الفعاليات',
			groups: 'المجموعات',
		},
	},
};

const deviceLng = Localization.getLocales?.()[0]?.languageCode || 'en';

i18n.use(initReactI18next).init({
	resources,
	lng: deviceLng,
	fallbackLng: 'en',
	interpolation: { escapeValue: false },
});

export default i18n;