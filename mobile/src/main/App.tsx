import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { useColorScheme } from 'react-native';
import * as Localization from 'expo-localization';
import { store } from '../store';
import '../services/i18n';
import HomeScreen from '../screens/HomeScreen';
import HijriCalendarScreen from '../screens/HijriCalendarScreen';
import ZakatScreen from '../screens/ZakatScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createNativeStackNavigator();

function RootNavigator() {
	const scheme = useColorScheme();
	useEffect(() => {
		// any startup logic
	}, []);
	return (
		<NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
			<Stack.Navigator>
				<Stack.Screen name="Home" component={HomeScreen} />
				<Stack.Screen name="HijriCalendar" component={HijriCalendarScreen} />
				<Stack.Screen name="Zakat" component={ZakatScreen} />
				<Stack.Screen name="Search" component={SearchScreen} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default function App() {
	return (
		<Provider store={store}>
			<RootNavigator />
		</Provider>
	);
}