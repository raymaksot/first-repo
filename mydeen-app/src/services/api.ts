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

export interface Paginated<T> {
	data: T[];
	page: number;
	limit: number;
	total: number;
}