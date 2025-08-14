import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import * as Location from 'expo-location';
import dayjs from 'dayjs';
import { prayerService, PrayerTimesResponse } from '@/services/prayerService';
import { useAppSelector } from '@/store/hooks';

export default function PrayerTimesScreen() {
	const [data, setData] = useState<PrayerTimesResponse[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const calcMethod = useAppSelector((s) => s.preferences.prayer.calculationMethod);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const { status } = await Location.requestForegroundPermissionsAsync();
				if (status !== 'granted') {
					setError('Location permission denied');
					return;
				}
				const loc = await Location.getCurrentPositionAsync({});
				const now = new Date();
				const res = await prayerService.getMonthTimes(
					loc.coords.latitude,
					loc.coords.longitude,
					now.getMonth() + 1,
					now.getFullYear(),
					calcMethod
				);
				setData(res);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [calcMethod]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Prayer Calendar</Text>
			{error ? <Text style={{ color: 'red' }}>{error}</Text> : null}
			<FlatList
				data={data}
				keyExtractor={(item) => item.date}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={{ width: 100 }}>{dayjs(item.date).format('DD MMM')}</Text>
						<Text style={styles.cell}>Fajr {item.fajr}</Text>
						<Text style={styles.cell}>Dhuhr {item.dhuhr}</Text>
						<Text style={styles.cell}>Asr {item.asr}</Text>
						<Text style={styles.cell}>Maghrib {item.maghrib}</Text>
						<Text style={styles.cell}>Isha {item.isha}</Text>
					</View>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : 'No data'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#fff',
		borderRadius: 10,
		padding: 12,
		marginBottom: 8,
		elevation: 1,
	},
	cell: { width: 90 },
});