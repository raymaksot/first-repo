import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import App from '../main/App';
import * as api from '../services/api';
import { Provider } from 'react-redux';
import { store } from '../store';

jest.mock('../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('Integration flows', () => {
	beforeEach(() => {
		mockedApi.fetchHijriMonth.mockResolvedValue({
			yearHijri: 1446, monthHijri: 9,
			days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, gregorian: `2025-03-${(i + 1).toString().padStart(2, '0')}`, events: i === 0 ? [{ id: 'ramadan-start' }] : [] })),
			events: [{ id: 'ramadan-start', dateHijri: '1446-09-01', dateGregorian: '2025-03-01', title: 'Ramadan Begins' }],
		});
		mockedApi.fetchZakatThresholds.mockResolvedValue({ currency: 'USD', nisab: { gold: 5000, silver: 3500 } });
		mockedApi.donateZakat.mockResolvedValue({ status: 'succeeded', receiptUrl: 'http://receipt' });
	});

	it('loads Home and navigates to calendar', async () => {
		const { getByText } = render(<Provider store={store}><App /></Provider>);
		await waitFor(() => getByText('Home'));
		fireEvent.press(getByText('Hijri Calendar'));
		await waitFor(() => getByText('Hijri Calendar'));
	});

	it('calculates Zakat and completes payment', async () => {
		const { getByText, getAllByDisplayValue, getByPlaceholderText } = render(<Provider store={store}><App /></Provider>);
		fireEvent.press(getByText('Zakat'));
		await waitFor(() => getByText('Zakat'));
		fireEvent.changeText(getAllByDisplayValue('0')[0], '10000');
		await waitFor(() => getByText(/Calculated Zakat/));
		fireEvent.press(getByText('Pay'));
		await waitFor(() => getByText('Receipt: http://receipt'));
	});
});