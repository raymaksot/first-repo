import { api } from './api';
import { getCached, setCached } from '@/utils/cache';

export interface Surah {
	number: number;
	name: string; // Arabic
	englishName: string;
	englishNameTranslation?: string;
	numberOfAyahs: number;
	revelationType: 'Meccan' | 'Medinan';
}

export interface Ayah {
	number: number;
	text: string; // Arabic
	translation?: string;
	tafsir?: string;
}

export const quranService = {
	async getSurahs(): Promise<Surah[]> {
		const cacheKey = 'CACHE_QURAN_SURAHS_V1';
		const cached = await getCached<Surah[]>(cacheKey);
		if (cached) return cached;
		const res = await api.get('/api/quran/surahs');
		await setCached(cacheKey, res.data, 60 * 60 * 24 * 30); // 30 days
		return res.data;
	},
	async getSurahAyahs(surahNumber: number): Promise<Ayah[]> {
		const res = await api.get(`/api/quran/surah/${surahNumber}`);
		return res.data;
	},
};