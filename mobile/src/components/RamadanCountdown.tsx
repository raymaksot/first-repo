import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment-hijri';

export default function RamadanCountdown() {
	const days = useMemo(() => {
		const today = moment();
		const hijriMonth = today.iMonth() + 1; // 1..12
		const hijriYear = today.iYear();
		let target = moment().iYear(hijriYear).iMonth(8).iDate(1); // Ramadan is month 9 => index 8
		if (today.isAfter(target, 'day')) {
			target = moment().iYear(hijriYear + 1).iMonth(8).iDate(1);
		}
		const diff = target.startOf('day').diff(today.startOf('day'), 'days');
		return Math.max(diff, 0);
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Ramadan</Text>
			<Text style={styles.count}>{days}</Text>
			<Text style={styles.suffix}>days</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, borderRadius: 12, backgroundColor: '#0f766e', alignItems: 'center' },
	title: { color: 'white', fontSize: 16, marginBottom: 4 },
	count: { color: 'white', fontSize: 32, fontWeight: 'bold' },
	suffix: { color: 'white', fontSize: 12 },
});