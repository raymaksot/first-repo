import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/authService';
import { setAuthToken } from '@/services/api';
import { User } from '@/models/User';

export interface AuthState {
	token: string | null;
	user: User | null;
	status: 'idle' | 'loading' | 'failed';
	error?: string;
}

const initialState: AuthState = {
	token: null,
	user: null,
	status: 'idle',
};

const TOKEN_KEY = 'MYDEEN_TOKEN';
const USER_KEY = 'MYDEEN_USER';

export const initAuthFromStorage = createAsyncThunk('auth/init', async () => {
	const [token, userJson] = await Promise.all([
		SecureStore.getItemAsync(TOKEN_KEY),
		SecureStore.getItemAsync(USER_KEY),
	]);
	if (token) {
		setAuthToken(token);
	}
	const user = userJson ? (JSON.parse(userJson) as User) : null;
	return { token, user } as { token: string | null; user: User | null };
});

export const login = createAsyncThunk(
	'auth/login',
	async (payload: { email: string; password: string }) => {
		const res = await authService.login(payload.email, payload.password);
		await SecureStore.setItemAsync(TOKEN_KEY, res.token);
		await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user));
		setAuthToken(res.token);
		return res;
	}
);

export const register = createAsyncThunk(
	'auth/register',
	async (payload: { name: string; email: string; password: string }) => {
		const res = await authService.register(payload.name, payload.email, payload.password);
		await SecureStore.setItemAsync(TOKEN_KEY, res.token);
		await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user));
		setAuthToken(res.token);
		return res;
	}
);

export const googleLogin = createAsyncThunk('auth/googleLogin', async (idToken: string) => {
	const res = await authService.googleLogin(idToken);
	await SecureStore.setItemAsync(TOKEN_KEY, res.token);
	await SecureStore.setItemAsync(USER_KEY, JSON.stringify(res.user));
	setAuthToken(res.token);
	return res;
});

export const logout = createAsyncThunk('auth/logout', async () => {
	await SecureStore.deleteItemAsync(TOKEN_KEY);
	await SecureStore.deleteItemAsync(USER_KEY);
	setAuthToken(null);
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setUser(state, action: PayloadAction<User | null>) {
			state.user = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(initAuthFromStorage.fulfilled, (state, action) => {
				state.token = action.payload.token;
				state.user = action.payload.user;
			})
			.addCase(login.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.status = 'idle';
				state.token = action.payload.token;
				state.user = action.payload.user;
			})
			.addCase(login.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(register.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(register.fulfilled, (state, action) => {
				state.status = 'idle';
				state.token = action.payload.token;
				state.user = action.payload.user;
			})
			.addCase(register.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(googleLogin.pending, (state) => {
				state.status = 'loading';
				state.error = undefined;
			})
			.addCase(googleLogin.fulfilled, (state, action) => {
				state.status = 'idle';
				state.token = action.payload.token;
				state.user = action.payload.user;
			})
			.addCase(googleLogin.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message;
			})
			.addCase(logout.fulfilled, (state) => {
				state.token = null;
				state.user = null;
			});
	},
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;