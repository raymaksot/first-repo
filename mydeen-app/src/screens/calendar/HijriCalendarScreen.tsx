import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function HijriCalendarScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Hijri Calendar</Text>
			<Text>Events and Ramadan tools coming soon…</Text>
			<TouchableOpacity style={styles.btn}>
				<Text style={styles.btnText}>Open Ramadan Tools</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	btn: { marginTop: 12, backgroundColor: '#0E7490', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
	btnText: { color: '#fff' },
});