import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { devicesService } from '@/services/devicesService';

export async function registerDeviceTokenWithBackend(): Promise<string | undefined> {
	if (!Device.isDevice) return undefined;
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') return undefined;
	const token = (await Notifications.getExpoPushTokenAsync()).data;
	await devicesService.register(token);
	return token;
}