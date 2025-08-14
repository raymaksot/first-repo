# Mobile Modules

This folder contains app-agnostic modules for the Expo React Native app.

## Caching

Utilities in `src/utils/cache.ts` and `src/utils/storage.ts` provide a reusable caching layer built on AsyncStorage with TTL and versioning.

- Use `fetchWithCache(key, fetcher, { ttlMs, version, keyPrefix })` to wrap network calls.
- Predefined TTLs in `DefaultCacheTtls` for surah list, duas, and hadith collections.

Example:

```ts
import { fetchWithCache, DefaultCacheTtls, makeCacheKey } from '../utils/cache';
import { apiGet } from '../services/apiClient';

const key = makeCacheKey('quran:surah-list');
const list = await fetchWithCache(key, () => apiGet('/quran/surahs'), {
  ttlMs: DefaultCacheTtls.SurahList,
  version: 'v1',
  keyPrefix: 'quran',
});
```

## Prayer notifications & background refresh

- Hook: `src/notifications/usePrayerNotifications.ts` schedules Athan notifications for Fajr, Dhuhr, Asr, Maghrib, and Isha for the current day.
- Background task `midnight-refresh-prayer-times` refreshes at midnight and re-schedules notifications for the new day.

Setup:

1. Request permissions and register background refresh on app start.
2. Save user `coords` in `AsyncStorage` under `prefs:coords` and prayer preferences in `prefs:prayer`.
3. Call `refreshToday({ coords, prefs })` whenever preferences or location changes.

Testing in development:

- Temporarily shift times to a few minutes ahead by passing a custom `date` to `refreshToday` with manipulated `Date` or by editing the scheduleForDay function.
- On iOS Simulator, enable Background Fetch in Debug menu; on Android, background fetch is opportunistic.

## Preferences

Redux slice in `src/store/preferencesSlice.ts` stores language, theme, and prayer calculation settings. `loadPreferencesFromStorage` hydrates on boot.

- Call `bootstrapPreferences` from `src/store` during app initialization.
- `src/screens/Settings/PreferencesConnector.tsx` offers a hook to sync i18n language and save coordinates.

## Isha mapping fix

`src/prayer/prayerTimes.ts` maps `times.isha` to `isha` key explicitly to avoid label or mapping errors.