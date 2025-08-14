import 'dotenv/config';

export default ({ config }: any) => ({
	name: 'Islamic App',
	slug: 'islamic-app',
	version: '1.0.0',
	scheme: 'islamicapp',
	orientation: 'portrait',
	icon: './assets/icon.png',
	splash: {
		image: './assets/splash.png',
		resizeMode: 'contain',
		backgroundColor: '#ffffff',
	},
	extra: {
		apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3000',
		stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
		eas: {
			env: {
				API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3000',
				STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',
			},
		},
	},
	updates: {
		fallbackToCacheTimeout: 0,
	},
	assetBundlePatterns: ['**/*'],
	ios: {
		supportsTablet: true,
	},
	android: {
		adaptiveIcon: {
			foregroundImage: './assets/adaptive-icon.png',
			backgroundColor: '#ffffff',
		},
	},
	web: {
		bundler: 'metro',
	},
});