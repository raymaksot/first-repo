import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appStorage } from '@/utils/cache';

export interface NotificationsPreferencesState {
	prayerTimes: boolean;
	events: boolean;
	articles: boolean;
	groupMilestones: boolean;
}

const initialState: NotificationsPreferencesState = {
	prayerTimes: true,
	events: true,
	articles: true,
	groupMilestones: true,
};

const slice = createSlice({
	name: 'notificationsPreferences',
	initialState,
	reducers: {
		setNotificationsPrefs(state, action: PayloadAction<NotificationsPreferencesState>) {
			Object.assign(state, action.payload);
			void appStorage.setObject('prefs:notifications', state);
		},
		hydrate(state, action: PayloadAction<Partial<NotificationsPreferencesState>>) {
			Object.assign(state, { ...state, ...action.payload });
		},
	},
});

export const { setNotificationsPrefs, hydrate } = slice.actions;
export default slice.reducer;