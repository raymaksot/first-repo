import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import * as Location from 'expo-location';
import { prayerService } from './prayerService';
import { schedulePrayerNotifications } from './athan';
import { store } from '@/store';

const TASK_REFRESH_PRAYER = 'TASK_REFRESH_PRAYER_TIMES';

TaskManager.defineTask(TASK_REFRESH_PRAYER, async () => {
	try {
		const { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== 'granted') return BackgroundFetch.BackgroundFetchResult.NoData;
		const loc = await Location.getCurrentPositionAsync({});
		const state = store.getState();
		const method = state.preferences.prayer.calculationMethod;
		const res = await prayerService.getTodayTimes(loc.coords.latitude, loc.coords.longitude, method);
		await schedulePrayerNotifications(res);
		return BackgroundFetch.BackgroundFetchResult.NewData;
	} catch (e) {
		return BackgroundFetch.BackgroundFetchResult.Failed;
	}
});

export async function registerBackgroundTasks() {
	try {
		await BackgroundFetch.registerTaskAsync(TASK_REFRESH_PRAYER, {
			minimumInterval: 60 * 60, // 1 hour; system decides
			stopOnTerminate: false,
			startOnBoot: true,
		});
	} catch (e) {
		// ignore
	}
}