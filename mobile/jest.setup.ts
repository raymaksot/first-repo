import 'react-native-gesture-handler/jestSetup';

jest.mock('expo-constants', () => ({ expoConfig: { extra: { apiBaseUrl: 'http://localhost:3000', stripePublishableKey: '' } } }));
jest.mock('expo-sqlite', () => ({ openDatabaseAsync: jest.fn(async () => ({ execAsync: jest.fn(), runAsync: jest.fn(), getFirstAsync: jest.fn() })) }));
jest.mock('@stripe/stripe-react-native', () => ({
	StripeProvider: ({ children }: any) => children,
	useStripe: () => ({ handleNextAction: jest.fn(async () => ({ error: undefined, paymentIntent: {} })) }),
}));
jest.mock('@react-native-async-storage/async-storage', () => ({ setItem: jest.fn(), getItem: jest.fn() }));
jest.mock('@react-native-community/netinfo', () => ({ addEventListener: jest.fn(() => jest.fn()) }));