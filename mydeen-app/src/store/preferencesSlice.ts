import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark';

export interface PrayerPreferences {
	calculationMethod: string; // e.g., 'MWL', 'ISNA', 'Makkah'
	highLatitudeRule: string; // 'MidNight', 'Seventh', 'AngleBased'
	timezone?: string;
}

export interface PreferencesState {
	themeMode: ThemeMode;
	locale: string;
	prayer: PrayerPreferences;
}

const initialState: PreferencesState = {
	themeMode: 'light',
	locale: 'en',
	prayer: {
		calculationMethod: 'MWL',
		highLatitudeRule: 'MidNight',
	},
};

const preferencesSlice = createSlice({
	name: 'preferences',
	initialState,
	reducers: {
		setThemeMode(state, action: PayloadAction<ThemeMode>) {
			state.themeMode = action.payload;
		},
		setLocale(state, action: PayloadAction<string>) {
			state.locale = action.payload;
		},
		setPrayerPreferences(state, action: PayloadAction<PrayerPreferences>) {
			state.prayer = action.payload;
		},
	},
});

export const { setThemeMode, setLocale, setPrayerPreferences } = preferencesSlice.actions;
export default preferencesSlice.reducer;