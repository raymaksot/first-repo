import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
	en: {
		translation: {
			appName: 'Islamic App',
			home: 'Home',
			calendar: 'Hijri Calendar',
			zakat: 'Zakat',
			search: 'Search',
			downloadOffline: 'Download for offline use',
			offline: 'Offline',
			online: 'Online',
			ramadanCountdown: 'Days until Ramadan',
			payWith: 'Pay with {{method}}',
		},
	},
	ar: {
		translation: {
			appName: 'تطبيق إسلامي',
			home: 'الرئيسية',
			calendar: 'التقويم الهجري',
			zakat: 'الزكاة',
			search: 'بحث',
			downloadOffline: 'تحميل للاستخدام دون اتصال',
			offline: 'غير متصل',
			online: 'متصل',
			ramadanCountdown: 'الأيام حتى رمضان',
			payWith: 'ادفع بواسطة {{method}}',
		},
	},
};

if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		compatibilityJSON: 'v3',
		resources,
		lng: Localization.locale.split('-')[0] || 'en',
		fallbackLng: 'en',
		interpolation: { escapeValue: false },
	});
}

export default i18n;