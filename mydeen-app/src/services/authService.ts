import { api } from './api';
import { User } from '@/models/User';

export const authService = {
	async login(email: string, password: string): Promise<{ token: string; user: User }> {
		const res = await api.post('/api/auth/login', { email, password });
		return res.data;
	},
	async register(name: string, email: string, password: string): Promise<{ token: string; user: User }> {
		const res = await api.post('/api/auth/register', { name, email, password });
		return res.data;
	},
	async googleLogin(idToken: string): Promise<{ token: string; user: User }> {
		const res = await api.post('/api/auth/google', { idToken });
		return res.data;
	},
};