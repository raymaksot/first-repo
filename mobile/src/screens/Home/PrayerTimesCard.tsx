import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getPrayerTimesForToday } from '../../services/prayerService';
import { appStorage } from '../../utils/storage';
import { PrayerPreferences, Coordinates } from '../../prayer/prayerTypes';

export default function PrayerTimesCard() {
  const [times, setTimes] = useState<{ label: string; time: string }[]>([]);

  useEffect(() => {
    (async () => {
      const prefs = await appStorage.getObject<PrayerPreferences>('prefs:prayer');
      const coords = await appStorage.getObject<Coordinates>('prefs:coords');
      if (!prefs || !coords) return;
      const t = await getPrayerTimesForToday(coords, prefs);
      const fmt = (d: Date) => d.toLocaleTimeString();
      setTimes([
        { label: 'Fajr', time: fmt(t.fajr) },
        { label: 'Dhuhr', time: fmt(t.dhuhr) },
        { label: 'Asr', time: fmt(t.asr) },
        { label: 'Maghrib', time: fmt(t.maghrib) },
        { label: 'Isha', time: fmt(t.isha) },
      ]);
    })();
  }, []);

  return (
    <View>
      {times.map((p) => (
        <Text key={p.label}>{p.label}: {p.time}</Text>
      ))}
    </View>
  );
}