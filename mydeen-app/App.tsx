import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { store } from '@/store';
import RootNavigator from '@/navigation/RootNavigator';
import i18n from './src/i18n';
import { useAppSelector } from '@/store/hooks';
import { initAuthFromStorage } from '@/store/authSlice';
import { registerForPushNotificationsAsync } from '@/services/notifications';
import { registerBackgroundTasks } from '@/services/background';

function AppInner() {
	const themeMode = useAppSelector((s) => s.preferences.themeMode);
	const locale = useAppSelector((s) => s.preferences.locale);
	const navTheme = themeMode === 'dark' ? DarkTheme : DefaultTheme;

	useEffect(() => {
		store.dispatch(initAuthFromStorage());
		(async () => {
			if (Device.isDevice) {
				await registerForPushNotificationsAsync();
			}
			await registerBackgroundTasks();
		})();
	}, []);

	useEffect(() => {
		i18n.changeLanguage(locale);
	}, [locale]);

	return (
		<NavigationContainer theme={navTheme}>
			<StatusBar barStyle={themeMode === 'dark' ? 'light-content' : 'dark-content'} />
			<RootNavigator />
		</NavigationContainer>
	);
}

export default function App() {
	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
		}),
	});

	return (
		<Provider store={store}>
			<AppInner />
		</Provider>
	);
}