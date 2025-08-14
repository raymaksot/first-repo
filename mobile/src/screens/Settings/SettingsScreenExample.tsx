import React from 'react';
import { View, Text, Button } from 'react-native';
import { usePreferencesSync } from './PreferencesConnector';

export default function SettingsScreenExample() {
  const { prefs, updateLanguage, updateTheme, updatePrayer, saveCoordinates } = usePreferencesSync();

  return (
    <View>
      <Text>Language: {prefs.language}</Text>
      <Button title="Set English" onPress={() => updateLanguage('en')} />
      <Button title="Set Arabic" onPress={() => updateLanguage('ar')} />

      <Text>Theme: {prefs.theme}</Text>
      <Button title="Light" onPress={() => updateTheme('light')} />
      <Button title="Dark" onPress={() => updateTheme('dark')} />
      <Button title="System" onPress={() => updateTheme('system')} />

      <Text>Prayer Method: {prefs.prayer.calculationMethod}</Text>
      <Button
        title="MWL"
        onPress={() => updatePrayer({ ...prefs.prayer, calculationMethod: 'MuslimWorldLeague' })}
      />
      <Button
        title="Karachi"
        onPress={() => updatePrayer({ ...prefs.prayer, calculationMethod: 'Karachi' })}
      />
      <Text>Madhab: {prefs.prayer.madhab}</Text>
      <Button title="Shafi" onPress={() => updatePrayer({ ...prefs.prayer, madhab: 'Shafi' })} />
      <Button title="Hanafi" onPress={() => updatePrayer({ ...prefs.prayer, madhab: 'Hanafi' })} />

      <Button
        title="Save Coords (Makkah)"
        onPress={() => saveCoordinates(21.3891, 39.8579)}
      />
    </View>
  );
}