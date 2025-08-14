import { CalculationMethod, Madhab } from 'adhan';

export type PrayerKey = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type PrayerPreferences = {
  calculationMethod: keyof typeof CalculationMethod | 'Other';
  madhab: keyof typeof Madhab;
  timeZone?: string;
  latitudeAdjustmentMethod?: 'MiddleOfTheNight' | 'SeventhOfTheNight' | 'AngleBased';
};

export const CalculationMethodOptions: { key: keyof typeof CalculationMethod; label: string }[] = [
  { key: 'MuslimWorldLeague', label: 'Muslim World League' },
  { key: 'Egyptian', label: 'Egyptian General Authority' },
  { key: 'Karachi', label: 'University of Islamic Sciences, Karachi' },
  { key: 'UmmAlQura', label: 'Umm al-Qura, Makkah' },
  { key: 'Dubai', label: 'Dubai' },
  { key: 'MoonsightingCommittee', label: 'Moonsighting Committee' },
  { key: 'NorthAmerica', label: 'North America (ISNA)' },
  { key: 'Kuwait', label: 'Kuwait' },
  { key: 'Qatar', label: 'Qatar' },
  { key: 'Singapore', label: 'Singapore' },
  { key: 'Turkey', label: 'Turkey' },
  { key: 'Tehran', label: 'Tehran' },
} as const;

export const MadhabOptions: { key: keyof typeof Madhab; label: string }[] = [
  { key: 'Shafi', label: 'Shafi / Maliki / Hanbali' },
  { key: 'Hanafi', label: 'Hanafi' },
];