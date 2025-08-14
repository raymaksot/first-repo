import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { appStorage } from '../utils/storage';
import { PrayerPreferences } from '../prayer/prayerTypes';

export type ThemeMode = 'light' | 'dark' | 'system';

export type PreferencesState = {
  language: string;
  theme: ThemeMode;
  prayer: PrayerPreferences;
};

const initialState: PreferencesState = {
  language: 'en',
  theme: 'system',
  prayer: {
    calculationMethod: 'MuslimWorldLeague',
    madhab: 'Shafi',
  },
};

const slice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
      void appStorage.setString('prefs:language', state.language);
    },
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      void appStorage.setString('prefs:theme', state.theme);
    },
    setPrayerPreferences(state, action: PayloadAction<PrayerPreferences>) {
      state.prayer = action.payload;
      void appStorage.setObject('prefs:prayer', state.prayer);
    },
    hydrate(state, action: PayloadAction<Partial<PreferencesState>>) {
      Object.assign(state, { ...state, ...action.payload });
    },
  },
});

export const { setLanguage, setTheme, setPrayerPreferences, hydrate } = slice.actions;
export default slice.reducer;

export async function loadPreferencesFromStorage(): Promise<Partial<PreferencesState>> {
  const [language, theme, prayer] = await Promise.all([
    appStorage.getString('prefs:language'),
    appStorage.getString('prefs:theme'),
    appStorage.getObject<PrayerPreferences>('prefs:prayer'),
  ]);
  const result: Partial<PreferencesState> = {};
  if (language) result.language = language;
  if (theme === 'light' || theme === 'dark' || theme === 'system') result.theme = theme;
  if (prayer) result.prayer = prayer;
  return result;
}