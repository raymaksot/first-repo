import { api } from './api';
import { getCached, setCached } from '@/utils/cache';

export interface DuaCategory { _id: string; name: string; }
export interface Dua { _id: string; categoryId: string; title: string; arabic: string; translation?: string; audioUrl?: string; }

export const duasService = {
	async getCategories(): Promise<DuaCategory[]> {
		const cacheKey = 'CACHE_DUA_CATEGORIES_V1';
		const cached = await getCached<DuaCategory[]>(cacheKey);
		if (cached) return cached;
		const res = await api.get('/api/duas/categories');
		await setCached(cacheKey, res.data, 60 * 60 * 24 * 30);
		return res.data;
	},
	async getByCategory(categoryId: string): Promise<Dua[]> {
		const res = await api.get(`/api/duas/category/${categoryId}`);
		return res.data;
	},
};