import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Routes } from './routes';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

function Placeholder({ name }: { name: string }) {
  return <View accessibilityLabel={name} />;
}

export function AppNavigator() {
  const userRole = useSelector((s: RootState) => (s as any)?.auth?.user?.role ?? 'user');

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name={Routes.Home} children={() => <Placeholder name="Home" />} />
        <Tab.Screen name={Routes.Quran} children={() => <Placeholder name="Quran" />} />
        <Tab.Screen name={Routes.Duas} children={() => <Placeholder name="Duas" />} />
        <Tab.Screen name={Routes.Hadith} children={() => <Placeholder name="Hadith" />} />
        <Tab.Screen name={Routes.Places} children={() => <Placeholder name="Places" />} />
        <Tab.Screen name={Routes.Qibla} children={() => <Placeholder name="Qibla" />} />
        <Tab.Screen name={Routes.Zakat} children={() => <Placeholder name="Zakat" />} />
        <Tab.Screen name={Routes.Calendar} children={() => <Placeholder name="Calendar" />} />
        <Tab.Screen name={Routes.Settings} children={() => <Placeholder name="Settings" />} />
        {userRole === 'scholar' && (
          <Tab.Screen name={Routes.QAAnswer} children={() => <Placeholder name="QAAnswer" />} />
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
}