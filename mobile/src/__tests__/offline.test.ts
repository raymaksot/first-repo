import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import App from '../main/App';
import { Provider } from 'react-redux';
import { store } from '../store';
import * as offline from '../services/offline';

jest.mock('../services/offline');

const mockedOffline = offline as jest.Mocked<typeof offline>;

mockedOffline.observeNetwork.mockImplementation((cb) => {
	cb(false);
	return () => {};
});

mockedOffline.downloadAllDatasets.mockResolvedValue();

it('toggles offline download and shows status', async () => {
	const { getByText, getByRole } = render(<Provider store={store}><App /></Provider>);
	await waitFor(() => getByText('Home'));
	const switchEl = getByRole('switch');
	await act(async () => {
		fireEvent(switchEl, 'valueChange', true);
	});
	await waitFor(() => getByText(/Download: complete/));
});