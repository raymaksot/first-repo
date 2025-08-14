import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface HijriEvent {
	id: string;
	dateHijri: string; // e.g. 1446-09-01
	dateGregorian: string; // e.g. 2025-02-28
	title: string;
	description?: string;
	category?: 'ramadan' | 'eid' | 'hajj' | 'other';
}

export interface HijriMonthData {
	yearHijri: number;
	monthHijri: number; // 1..12
	startGregorian: string;
	endGregorian: string;
	days: Array<{
		day: number;
		gregorian: string;
		events?: string[]; // event ids
	}>;
}

interface CalendarState {
	currentMonth: HijriMonthData | null;
	eventsById: Record<string, HijriEvent>;
	loading: boolean;
	error?: string;
}

const initialState: CalendarState = {
	currentMonth: null,
	eventsById: {},
	loading: false,
};

const calendarSlice = createSlice({
	name: 'calendar',
	initialState,
	reducers: {
		startLoading(state) {
			state.loading = true;
			state.error = undefined;
		},
		setMonth(state, action: PayloadAction<HijriMonthData>) {
			state.currentMonth = action.payload;
			state.loading = false;
		},
		setEvents(state, action: PayloadAction<HijriEvent[]>) {
			for (const eventItem of action.payload) {
				state.eventsById[eventItem.id] = eventItem;
			}
		},
		setError(state, action: PayloadAction<string>) {
			state.loading = false;
			state.error = action.payload;
		},
	},
});

export const { startLoading, setMonth, setEvents, setError } = calendarSlice.actions;
export default calendarSlice.reducer;