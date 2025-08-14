import { api, Paginated } from './api';

export interface QAItem {
	_id: string;
	title: string;
	question: string;
	answer?: string;
	askedBy?: string;
	answeredBy?: string;
	createdAt?: string;
}

export const qaService = {
	async list(page = 1, limit = 20): Promise<Paginated<QAItem>> {
		const res = await api.get('/api/qa', { params: { page, limit } });
		return res.data;
	},
	async get(id: string): Promise<QAItem> {
		const res = await api.get(`/api/qa/${id}`);
		return res.data;
	},
	async answer(id: string, answer: string) {
		const res = await api.post(`/api/qa/${id}/answer`, { answer });
		return res.data as QAItem;
	},
};