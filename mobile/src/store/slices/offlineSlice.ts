import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OfflineState {
	isOffline: boolean;
	downloadStatus: 'idle' | 'downloading' | 'complete' | 'error';
	lastDownloadedAt?: number;
	errorMessage?: string;
}

const initialState: OfflineState = {
	isOffline: false,
	downloadStatus: 'idle',
};

const offlineSlice = createSlice({
	name: 'offline',
	initialState,
	reducers: {
		setOffline(state, action: PayloadAction<boolean>) {
			state.isOffline = action.payload;
		},
		setDownloadStatus(state, action: PayloadAction<OfflineState['downloadStatus']>) {
			state.downloadStatus = action.payload;
		},
		setDownloadError(state, action: PayloadAction<string>) {
			state.downloadStatus = 'error';
			state.errorMessage = action.payload;
		},
		setLastDownloadedAt(state, action: PayloadAction<number>) {
			state.lastDownloadedAt = action.payload;
		},
	},
});

export const { setOffline, setDownloadStatus, setDownloadError, setLastDownloadedAt } = offlineSlice.actions;
export default offlineSlice.reducer;