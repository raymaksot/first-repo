import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { useCallback, useEffect, useRef } from 'react';
import { computePrayerTimes } from '../prayer/prayerTimes';
import { PrayerPreferences, Coordinates, PrayerKey } from '../prayer/prayerTypes';
import { appStorage } from '../utils/storage';

export const BACKGROUND_TASK_NAME = 'midnight-refresh-prayer-times';

export type ScheduleInput = {
  coords: Coordinates;
  prefs: PrayerPreferences;
  date?: Date; // defaults to today
};

type Scheduled = { id: string; prayer: PrayerKey; when: number }[];

async function ensurePermissionsAndChannel() {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
  await Notifications.setNotificationChannelAsync?.('athans', {
    name: 'Athan Alerts',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  } as any);
}

async function scheduleForDay({ coords, prefs, date = new Date() }: ScheduleInput): Promise<Scheduled> {
  await ensurePermissionsAndChannel();
  const times = computePrayerTimes(date, coords, prefs);

  const prayers: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

  const created: Scheduled = [];
  for (const p of prayers) {
    const when = times[p].getTime();
    if (when <= Date.now()) continue; // skip past times
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Prayer Time',
        body: `It's time for ${p.toUpperCase()}`,
        sound: 'default',
        channelId: 'athans',
      },
      trigger: { date: new Date(when) },
    });
    created.push({ id, prayer: p, when });
  }

  await appStorage.setObject('notifications:athans', created);
  return created;
}

async function cancelExisting(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await appStorage.remove('notifications:athans');
}

export function usePrayerNotifications() {
  const lastScheduleRef = useRef<Scheduled | null>(null);

  const refreshToday = useCallback(async (input: ScheduleInput) => {
    await cancelExisting();
    const scheduled = await scheduleForDay(input);
    lastScheduleRef.current = scheduled;
    return scheduled;
  }, []);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  }, []);

  useEffect(() => {
    (async () => {
      const existing = await appStorage.getObject<Scheduled>('notifications:athans');
      if (!existing) return;
      const today = new Date();
      const hasToday = existing.some((n) => new Date(n.when).getDate() === today.getDate());
      if (!hasToday) {
        const prefs = await appStorage.getObject<PrayerPreferences>('prefs:prayer');
        const coords = await appStorage.getObject<Coordinates>('prefs:coords');
        if (prefs && coords) {
          await refreshToday({ coords, prefs, date: today });
        }
      }
    })();
  }, [refreshToday]);

  return { refreshToday, lastScheduleRef };
}

// Background task to run shortly after midnight and reschedule for the new day
TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const prefs = await appStorage.getObject<PrayerPreferences>('prefs:prayer');
    const coords = await appStorage.getObject<Coordinates>('prefs:coords');
    if (!prefs || !coords) {
      return BackgroundFetch.Result.NoData;
    }

    await cancelExisting();
    await scheduleForDay({ coords, prefs, date: new Date() });
    return BackgroundFetch.Result.NewData;
  } catch (e) {
    return BackgroundFetch.Result.Failed;
  }
});

export async function registerMidnightRefresh(): Promise<void> {
  await BackgroundFetch.registerTaskAsync(BACKGROUND_TASK_NAME, {
    minimumInterval: 60 * 60, // 1 hour; OS chooses best time. We'll aim for soon after midnight
    stopOnTerminate: false,
    startOnBoot: true,
    requiresBatteryNotLow: false,
    requiresCharging: false,
  });
}

export async function unregisterMidnightRefresh(): Promise<void> {
  try {
    await BackgroundFetch.unregisterTaskAsync(BACKGROUND_TASK_NAME);
  } catch {}
}