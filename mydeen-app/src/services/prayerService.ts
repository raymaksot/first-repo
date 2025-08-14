import { api } from './api';

export interface PrayerTimesResponse {
	date: string;
	fajr: string;
	dhuhr: string;
	asr: string;
	maghrib: string;
	isha: string;
	imsak?: string;
}

export const prayerService = {
	async getTodayTimes(lat: number, lng: number, method?: string) {
		const res = await api.get('/api/prayer/times', { params: { lat, lng, method } });
		return res.data as PrayerTimesResponse;
	},
	async getMonthTimes(lat: number, lng: number, month: number, year: number, method?: string) {
		const res = await api.get('/api/prayer/month', { params: { lat, lng, month, year, method } });
		return res.data as PrayerTimesResponse[];
	},
};