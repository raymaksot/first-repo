import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import preferencesReducer from './slices/preferencesSlice';
import calendarReducer from './slices/calendarSlice';
import zakatReducer from './slices/zakatSlice';
import offlineReducer from './slices/offlineSlice';

export const store = configureStore({
	reducer: {
		auth: authReducer,
		preferences: preferencesReducer,
		calendar: calendarReducer,
		zakat: zakatReducer,
		offline: offlineReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;