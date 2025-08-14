import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAppSelector } from '@/store/hooks';
import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import QuranScreen from '@/screens/quran/QuranScreen';
import HadithScreen from '@/screens/hadith/HadithScreen';
import DuasScreen from '@/screens/duas/DuasScreen';
import PlacesScreen from '@/screens/places/PlacesScreen';
import QAScreen from '@/screens/qa/QAScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import PrayerTimesScreen from '@/screens/prayer/PrayerTimesScreen';
import HijriCalendarScreen from '@/screens/calendar/HijriCalendarScreen';
import ZakatCalculatorScreen from '@/screens/zakat/ZakatCalculatorScreen';
import ArticleDetailScreen from '@/screens/articles/ArticleDetailScreen';
import SurahDetailScreen from '@/screens/quran/SurahDetailScreen';
import VerseDetailScreen from '@/screens/quran/VerseDetailScreen';
import QADetailScreen from '@/screens/qa/QADetailScreen';
import AdminDashboardScreen from '@/screens/admin/AdminDashboardScreen';
import ReadingGroupsScreen from '@/screens/groups/ReadingGroupsScreen';
import GroupDetailScreen from '@/screens/groups/GroupDetailScreen';
import EventsScreen from '@/screens/events/EventsScreen';
import EventDetailScreen from '@/screens/events/EventDetailScreen';
import { TermsScreen, PrivacyScreen } from '@/screens/settings/TermsPrivacyScreens';

const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainTabs() {
	return (
		<Tabs.Navigator>
			<Tabs.Screen name="Home" component={HomeScreen} />
			<Tabs.Screen name="Quran" component={QuranScreen} />
			<Tabs.Screen name="Duas" component={DuasScreen} />
			<Tabs.Screen name="Hadith" component={HadithScreen} />
			<Tabs.Screen name="QA" component={QAScreen} />
			<Tabs.Screen name="Places" component={PlacesScreen} />
			<Tabs.Screen name="Groups" component={ReadingGroupsScreen} />
			<Tabs.Screen name="Events" component={EventsScreen} />
		</Tabs.Navigator>
	);
}

export default function RootNavigator() {
	const token = useAppSelector((s) => s.auth.token);
	const user = useAppSelector((s) => s.auth.user);
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			{!token ? (
				<>
					<Stack.Screen name="Login" component={LoginScreen} />
					<Stack.Screen name="Register" component={RegisterScreen} />
				</>
			) : (
				<>
					<Stack.Screen name="Main" component={MainTabs} />
					<Stack.Screen name="PrayerTimes" component={PrayerTimesScreen} />
					<Stack.Screen name="HijriCalendar" component={HijriCalendarScreen} />
					<Stack.Screen name="Zakat" component={ZakatCalculatorScreen} />
					<Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
					<Stack.Screen name="SurahDetail" component={SurahDetailScreen} />
					<Stack.Screen name="VerseDetail" component={VerseDetailScreen} />
					<Stack.Screen name="QADetail" component={QADetailScreen} />
					<Stack.Screen name="GroupDetail" component={GroupDetailScreen} />
					<Stack.Screen name="EventDetail" component={EventDetailScreen} />
					{user?.role === 'admin' && <Stack.Screen name="Admin" component={AdminDashboardScreen} />}
					<Stack.Screen name="Terms" component={TermsScreen} />
					<Stack.Screen name="Privacy" component={PrivacyScreen} />
					<Stack.Screen name="Settings" component={SettingsScreen} />
				</>
			)}
		</Stack.Navigator>
	);
}