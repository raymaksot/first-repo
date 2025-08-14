import { Coordinates, PrayerKey, PrayerPreferences } from './prayerTypes';
import { CalculationMethod, Madhab, PrayerTimes, Qibla, Coordinates as AdhanCoordinates } from 'adhan';

export type DayPrayerTimes = Record<PrayerKey, Date> & { date: Date };

function mapPreferencesToParams(prefs: PrayerPreferences) {
  const method = CalculationMethod[prefs.calculationMethod as keyof typeof CalculationMethod] ?? CalculationMethod.MuslimWorldLeague;
  const madhab = Madhab[prefs.madhab as keyof typeof Madhab] ?? Madhab.Shafi;
  return { method, madhab };
}

export function computePrayerTimes(date: Date, coords: Coordinates, prefs: PrayerPreferences): DayPrayerTimes {
  const { method, madhab } = mapPreferencesToParams(prefs);
  const params = method();
  params.madhab = madhab;

  const adhanCoords = new AdhanCoordinates(coords.latitude, coords.longitude);
  const times = new PrayerTimes(adhanCoords, date, params);

  const mapping: DayPrayerTimes = {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha, // ensure correct Isha mapping
    date,
  };

  return mapping;
}

export function getQiblaDirection(coords: Coordinates): number {
  const adhanCoords = new AdhanCoordinates(coords.latitude, coords.longitude);
  return new Qibla(adhanCoords).direction;
}