import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PreferencesState {
	locale: string;
	currency: string;
	nisabGold: number | null;
	nisabSilver: number | null;
}

const initialState: PreferencesState = {
	locale: 'en',
	currency: 'USD',
	nisabGold: null,
	nisabSilver: null,
};

const preferencesSlice = createSlice({
	name: 'preferences',
	initialState,
	reducers: {
		setLocale(state, action: PayloadAction<string>) {
			state.locale = action.payload;
		},
		setCurrency(state, action: PayloadAction<string>) {
			state.currency = action.payload;
		},
		setNisabThresholds(state, action: PayloadAction<{ gold: number; silver: number }>) {
			state.nisabGold = action.payload.gold;
			state.nisabSilver = action.payload.silver;
		},
	},
});

export const { setLocale, setCurrency, setNisabThresholds } = preferencesSlice.actions;
export default preferencesSlice.reducer;