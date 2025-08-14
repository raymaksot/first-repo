import * as Notifications from 'expo-notifications';
import dayjs from 'dayjs';
import { PrayerTimesResponse } from './prayerService';

function toFutureDate(timeStr: string): Date | null {
	if (!timeStr) return null;
	const [h, m] = timeStr.split(':').map((s) => parseInt(s, 10));
	if (isNaN(h) || isNaN(m)) return null;
	let dt = dayjs().hour(h).minute(m).second(0).millisecond(0);
	if (dt.isBefore(dayjs())) dt = dt.add(1, 'day');
	return dt.toDate();
}

export async function schedulePrayerNotifications(times: PrayerTimesResponse) {
	const mapping: [string, string][] = [
		['Fajr', times.fajr],
		['Dhuhr', times.dhuhr],
		['Asr', times.asr],
		['Maghrib', times.maghrib],
		['Isha', times.isha],
	];
	for (const [name, t] of mapping) {
		const when = toFutureDate(t);
		if (!when) continue;
		await Notifications.scheduleNotificationAsync({
			content: { title: `Athan - ${name}`, body: `${name} time has arrived` },
			trigger: when,
		});
	}
}