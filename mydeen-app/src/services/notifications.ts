import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
	let token: string | undefined;
	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			return undefined;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
		if (Platform.OS === 'android') {
			Notifications.setNotificationChannelAsync('default', {
				name: 'default',
				importance: Notifications.AndroidImportance.MAX,
				sound: 'default',
			});
		}
	}
	return token;
}

export async function notifyContent(title: string, body: string, data?: Record<string, string>): Promise<void> {
	await Notifications.scheduleNotificationAsync({ content: { title, body, data }, trigger: null });
}