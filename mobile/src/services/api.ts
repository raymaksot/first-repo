import axios from 'axios';
import Constants from 'expo-constants';
import { store } from '../store';

const apiBaseUrl = (Constants.expoConfig?.extra as any)?.apiBaseUrl || (Constants.manifest2?.extra as any)?.apiBaseUrl || 'http://localhost:3000';

export const api = axios.create({
	baseURL: apiBaseUrl,
	timeout: 15000,
});

api.interceptors.request.use((config) => {
	const state = store.getState();
	const token = state.auth.token;
	if (token) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export interface HijriMonthResponse {
	yearHijri: number;
	monthHijri: number;
	days: Array<{ day: number; gregorian: string; events?: Array<{ id: string }> }>;
	events: Array<{ id: string; dateHijri: string; dateGregorian: string; title: string; description?: string; category?: string }>; 
}

export async function fetchHijriMonth(): Promise<HijriMonthResponse> {
	const { data } = await api.get('/api/events/hijri');
	return data;
}

export async function fetchZakatThresholds() {
	const { data } = await api.get('/api/zakat/thresholds');
	return data as { currency: string; nisab: { gold: number; silver: number } };
}

export async function donateZakat(payload: { amount: number; currency: string; method: 'stripe' | 'paypal'; paymentMethodId?: string; }) {
	const { data } = await api.post('/api/zakat/donate', payload);
	return data as { status: 'requires_action' | 'succeeded' | 'failed'; clientSecret?: string; receiptUrl?: string; errorMessage?: string };
}

export async function fetchQuranAll() {
	const { data } = await api.get('/api/quran/all');
	return data as any[];
}

export async function fetchDuasAll() {
	const { data } = await api.get('/api/duas/all');
	return data as any[];
}

export async function fetchHadithAll() {
	const { data } = await api.get('/api/hadith/all');
	return data as any[];
}