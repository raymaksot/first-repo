import axios from 'axios';
import { ENV } from '@/config/env';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
	authToken = token;
};

export const api = axios.create({
	baseURL: ENV.backendBaseUrl,
	timeout: 15000,
});

api.interceptors.request.use((config) => {
	if (authToken) {
		config.headers = config.headers || {};
		config.headers.Authorization = `Bearer ${authToken}`;
	}
	return config;
});

api.interceptors.response.use(
	(resp) => resp,
	(error) => {
		const message = error?.response?.data?.message || error.message;
		return Promise.reject(new Error(message));
	}
);

export async function apiGet<T = any>(url: string, config?: any): Promise<T> {
	const { data } = await api.get<T>(url, config);
	return data;
}

export async function apiPost<T = any>(url: string, body?: any, config?: any): Promise<T> {
	const { data } = await api.post<T>(url, body, config);
	return data;
}

export async function apiDelete<T = any>(url: string, config?: any): Promise<T> {
	const { data } = await api.delete<T>(url, config);
	return data;
}

export interface Paginated<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
}