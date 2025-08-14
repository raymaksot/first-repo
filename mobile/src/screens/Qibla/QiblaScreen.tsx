import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { getQiblaDirection } from '../../prayer/prayerTimes';
import { appStorage } from '../../utils/storage';

export default function QiblaScreen() {
  const [direction, setDirection] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const coords = await appStorage.getObject<{ latitude: number; longitude: number }>('prefs:coords');
      if (!coords) return;
      const d = getQiblaDirection(coords);
      setDirection(d);
    })();
  }, []);

  return (
    <View>
      <Text>Qibla direction: {direction?.toFixed(2)}°</Text>
    </View>
  );
}