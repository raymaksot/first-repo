import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { setLanguage, setPrayerPreferences, setTheme } from '../../store/preferencesSlice';
import { setLanguage as applyI18nLanguage, ensureI18n } from '../../i18n';
import { appStorage } from '../../utils/storage';
import { PrayerPreferences } from '../../prayer/prayerTypes';
import { usePrayerNotifications } from '../../notifications/usePrayerNotifications';

ensureI18n();

export function usePreferencesSync() {
  const dispatch = useDispatch();
  const prefs = useSelector((s: RootState) => s.preferences);
  const { refreshToday } = usePrayerNotifications();

  useEffect(() => {
    void applyI18nLanguage(prefs.language);
  }, [prefs.language]);

  useEffect(() => {
    (async () => {
      const coords = await appStorage.getObject<{ latitude: number; longitude: number }>('prefs:coords');
      if (coords) {
        await refreshToday({ coords, prefs: prefs.prayer });
      }
    })();
  }, [prefs.prayer, refreshToday]);

  const updateLanguage = (lang: string) => dispatch(setLanguage(lang));
  const updateTheme = (theme: 'light' | 'dark' | 'system') => dispatch(setTheme(theme));
  const updatePrayer = (prayer: PrayerPreferences) => dispatch(setPrayerPreferences(prayer));

  const saveCoordinates = async (lat: number, lng: number) => {
    await appStorage.setObject('prefs:coords', { latitude: lat, longitude: lng });
    await refreshToday({ coords: { latitude: lat, longitude: lng }, prefs: prefs.prayer });
  };

  return { prefs, updateLanguage, updateTheme, updatePrayer, saveCoordinates };
}

export default function PreferencesConnector() {
  usePreferencesSync();
  return null;
}