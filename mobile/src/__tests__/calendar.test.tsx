import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import HijriCalendarScreen from '../screens/HijriCalendarScreen';
import { Provider } from 'react-redux';
import { store } from '../store';
import * as api from '../services/api';

jest.mock('../services/api');

const mockedApi = api as jest.Mocked<typeof api>;

it('shows event modal when tapping a day with events', async () => {
	mockedApi.fetchHijriMonth.mockResolvedValue({
		yearHijri: 1446, monthHijri: 9,
		days: Array.from({ length: 30 }).map((_, i) => ({ day: i + 1, gregorian: `2025-03-${(i + 1).toString().padStart(2, '0')}`, events: i === 0 ? [{ id: 'ramadan-start' }] : [] })),
		events: [{ id: 'ramadan-start', dateHijri: '1446-09-01', dateGregorian: '2025-03-01', title: 'Ramadan Begins' }],
	});
	const { getByText, findByText } = render(<Provider store={store}><HijriCalendarScreen /></Provider>);
	await findByText('Hijri Calendar');
	const dayCell = await findByText('1');
	fireEvent.press(dayCell);
	await waitFor(() => getByText('Events'));
	await waitFor(() => getByText('Ramadan Begins'));
});