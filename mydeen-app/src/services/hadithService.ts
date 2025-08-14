import { api, Paginated } from './api';

export interface Hadith {
	_id: string;
	collection: string;
	bookNumber?: string;
	number?: string;
	text: string;
	translation?: string;
}

export const hadithService = {
	async search(query: string, page = 1, limit = 20): Promise<Paginated<Hadith>> {
		const res = await api.get('/api/hadith/search', { params: { q: query, page, limit } });
		return res.data;
	},
};