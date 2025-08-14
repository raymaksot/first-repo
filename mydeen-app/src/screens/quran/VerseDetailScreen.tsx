import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';

export default function VerseDetailScreen() {
	const route = useRoute<any>();
	const ayah = route.params?.ayah;
	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
			<Text style={styles.ar}>{ayah?.text}</Text>
			{ayah?.translation ? <Text style={styles.tr}>{ayah.translation}</Text> : null}
			<Text style={styles.section}>Tafsir</Text>
			<Text>{ayah?.tafsir || 'Coming soon...'}</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	ar: { fontSize: 24, textAlign: 'right', marginBottom: 12 },
	tr: { color: '#6b7280', marginBottom: 12 },
	section: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
});