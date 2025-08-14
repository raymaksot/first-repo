import { configureStore } from '@reduxjs/toolkit';
import preferencesReducer, { hydrate, loadPreferencesFromStorage } from './preferencesSlice';
import commentsReducer from './commentsSlice';
import authReducer from './authSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		preferences: preferencesReducer,
		comments: commentsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export async function bootstrapPreferences(onApply?: (state: RootState) => void) {
	const saved = await loadPreferencesFromStorage();
	store.dispatch(hydrate(saved));
	onApply?.(store.getState());
}