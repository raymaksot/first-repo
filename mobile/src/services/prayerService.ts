import { computePrayerTimes, DayPrayerTimes } from '../prayer/prayerTimes';
import { Coordinates, PrayerPreferences } from '../prayer/prayerTypes';
import { apiGet } from './apiClient';
import { normalizePrayerApiResponse } from '../prayer/normalize';

export async function getPrayerTimesForDate(
  date: Date,
  coords: Coordinates,
  prefs: PrayerPreferences,
  options?: { preferRemote?: boolean }
): Promise<DayPrayerTimes> {
  if (options?.preferRemote) {
    try {
      const params = new URLSearchParams({
        lat: String(coords.latitude),
        lng: String(coords.longitude),
        date: date.toISOString(),
        method: String(prefs.calculationMethod),
        madhab: String(prefs.madhab),
      }).toString();
      const data = await apiGet<any>(`/prayers?${params}`);
      return normalizePrayerApiResponse(data, date);
    } catch (e) {
      // fall through to local compute
    }
  }

  return computePrayerTimes(date, coords, prefs);
}

export async function getPrayerTimesForToday(coords: Coordinates, prefs: PrayerPreferences, options?: { preferRemote?: boolean }): Promise<DayPrayerTimes> {
  return getPrayerTimesForDate(new Date(), coords, prefs, options);
}