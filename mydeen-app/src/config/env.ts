import Constants from 'expo-constants';

const extra = (Constants?.expoConfig as any)?.extra || (Constants?.manifest as any)?.extra || {};

export const ENV = {
	backendBaseUrl: extra.backendBaseUrl || process.env.EXPO_PUBLIC_API_BASE_URL || process.env.BACKEND_BASE_URL || 'http://10.0.2.2:3000',
	googleWebClientId: extra.googleWebClientId || process.env.GOOGLE_WEB_CLIENT_ID || '',
	googleMapsApiKey: extra.googleMapsApiKey || process.env.GOOGLE_MAPS_API_KEY || '',
};