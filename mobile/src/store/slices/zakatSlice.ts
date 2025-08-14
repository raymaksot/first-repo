import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ZakatAssetInput {
	cash: number;
	goldValue: number;
	silverValue: number;
	investments: number;
	debt: number;
}

export interface PaymentState {
	status: 'idle' | 'processing' | 'success' | 'failed';
	receiptUrl?: string;
	errorMessage?: string;
}

interface ZakatState {
	assets: ZakatAssetInput;
	calculatedZakat: number;
	payment: PaymentState;
}

const initialState: ZakatState = {
	assets: { cash: 0, goldValue: 0, silverValue: 0, investments: 0, debt: 0 },
	calculatedZakat: 0,
	payment: { status: 'idle' },
};

const zakatSlice = createSlice({
	name: 'zakat',
	initialState,
	reducers: {
		setAssets(state, action: PayloadAction<ZakatAssetInput>) {
			state.assets = action.payload;
		},
		setCalculatedZakat(state, action: PayloadAction<number>) {
			state.calculatedZakat = action.payload;
		},
		setPaymentProcessing(state) {
			state.payment = { status: 'processing' };
		},
		setPaymentSuccess(state, action: PayloadAction<{ receiptUrl?: string }>) {
			state.payment = { status: 'success', receiptUrl: action.payload.receiptUrl };
		},
		setPaymentFailed(state, action: PayloadAction<string>) {
			state.payment = { status: 'failed', errorMessage: action.payload };
		},
		resetPayment(state) {
			state.payment = { status: 'idle' };
		},
	},
});

export const {
	setAssets,
	setCalculatedZakat,
	setPaymentProcessing,
	setPaymentSuccess,
	setPaymentFailed,
	resetPayment,
} = zakatSlice.actions;
export default zakatSlice.reducer;