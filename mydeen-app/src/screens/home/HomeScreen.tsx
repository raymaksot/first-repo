import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import dayjs from 'dayjs';
import { prayerService, PrayerTimesResponse } from '@/services/prayerService';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/store/hooks';
import { schedulePrayerNotifications } from '@/services/athan';

export default function HomeScreen() {
	const navigation = useNavigation<any>();
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [times, setTimes] = useState<PrayerTimesResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const calcMethod = useAppSelector((s) => s.preferences.prayer.calculationMethod);
	const [syncing, setSyncing] = useState(false);

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				setError('Location permission denied');
				return;
			}
			const loc = await Location.getCurrentPositionAsync({});
			const lat = loc.coords.latitude;
			const lng = loc.coords.longitude;
			setCoords({ lat, lng });
			try {
				const res = await prayerService.getTodayTimes(lat, lng, calcMethod);
				setTimes(res);
				await schedulePrayerNotifications(res);
			} catch (e: any) {
				setError(e.message);
			}
		})();
	}, [calcMethod]);

	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
			<Text style={styles.title}>Assalamu Alaikum</Text>
			<View style={styles.card}>
				<Text style={styles.sectionTitle}>Today's Prayer Times</Text>
				{times ? (
					<View>
						<Text>Fajr: {times.fajr}</Text>
						<Text>Dhuhr: {times.dhuhr}</Text>
						<Text>Asr: {times.asr}</Text>
						<Text>Maghrib: {times.maghrib}</Text>
						<Text>Isha: {times.isha}</Text>
					</View>
				) : (
					<Text>{error || 'Loading...'}</Text>
				)}
				<TouchableOpacity style={styles.linkBtn} onPress={() => navigation.navigate('PrayerTimes')}>
					<Text style={styles.linkText}>View Calendar</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.quickGrid}>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Quran')}>
					<Text>Qur'an</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Duas')}>
					<Text>Duas</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Hadith')}>
					<Text>Hadith</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('QA')}>
					<Text>Q&A</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Places')}>
					<Text>Places</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Groups')}>
					<Text>Groups</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.quickItem} onPress={() => navigation.navigate('Events')}>
					<Text>Events</Text>
				</TouchableOpacity>
			</View>

			<View style={[styles.card, { marginTop: 16 }]}>
				<Text style={styles.sectionTitle}>Sync</Text>
				<Text style={{ color: syncing ? '#0E7490' : '#6b7280' }}>{syncing ? 'Syncing changes…' : 'All changes synced'}</Text>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	title: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
	card: {
		backgroundColor: '#fff',
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOpacity: 0.05,
		shadowRadius: 8,
		elevation: 2,
	},
	sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
	linkBtn: { marginTop: 8 },
	linkText: { color: '#0E7490', fontWeight: '600' },
	quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
	quickItem: { backgroundColor: '#F5F7FA', padding: 16, borderRadius: 8, width: '48%', alignItems: 'center' },
});