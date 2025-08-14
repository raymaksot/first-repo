import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { quranService, Ayah, Surah } from '@/services/quranService';

export default function SurahDetailScreen() {
	const route = useRoute<any>() as RouteProp<any>;
	const navigation = useNavigation<any>();
	const surah = (route.params?.surah || {}) as Surah;
	const [ayahs, setAyahs] = useState<Ayah[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const data = await quranService.getSurahAyahs(surah.number);
				setAyahs(data);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, [surah?.number]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{surah.englishName} - {surah.name}</Text>
			<FlatList
				data={ayahs}
				keyExtractor={(item) => String(item.number)}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.row} onPress={() => navigation.navigate('VerseDetail', { ayah: item })}>
						<Text style={styles.ar}>{item.text}</Text>
						{item.translation ? <Text style={styles.tr}>{item.translation}</Text> : null}
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : error || 'No data'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	row: { paddingVertical: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
	ar: { fontSize: 20, textAlign: 'right' },
	tr: { color: '#6b7280', marginTop: 6 },
});