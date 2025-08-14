import { DayPrayerTimes } from './prayerTimes';
import { PrayerKey } from './prayerTypes';

const PRAYER_ALIASES: Record<PrayerKey, string[]> = {
  fajr: ['fajr', 'fajar', 'subh'],
  sunrise: ['sunrise', 'shuruq', 'sun rise'],
  dhuhr: ['dhuhr', 'zuhr', 'zohar', 'dhur'],
  asr: ['asr'],
  maghrib: ['maghrib', 'magrib', 'magrheb'],
  isha: ['isha', 'isha', "isha'a", 'isya', 'ishaawwal', 'isha_1'],
};

function findByAliases(obj: any, key: PrayerKey): Date | null {
  const aliases = PRAYER_ALIASES[key];
  for (const name of aliases) {
    const v = obj[name] ?? obj[name.toUpperCase?.()] ?? obj[name.toLowerCase?.()];
    if (v) {
      const date = new Date(v);
      if (!isNaN(date.getTime())) return date;
    }
  }
  return null;
}

export function normalizePrayerApiResponse(raw: any, forDate: Date): DayPrayerTimes {
  const data = raw?.data ?? raw?.times ?? raw ?? {};
  const baseDate = new Date(forDate);

  const result = {
    fajr: findByAliases(data, 'fajr') ?? new Date(baseDate),
    sunrise: findByAliases(data, 'sunrise') ?? new Date(baseDate),
    dhuhr: findByAliases(data, 'dhuhr') ?? new Date(baseDate),
    asr: findByAliases(data, 'asr') ?? new Date(baseDate),
    maghrib: findByAliases(data, 'maghrib') ?? new Date(baseDate),
    isha: findByAliases(data, 'isha') ?? new Date(baseDate),
    date: baseDate,
  } as DayPrayerTimes;

  return result;
}