import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { quranService, Surah } from '@/services/quranService';
import { useNavigation } from '@react-navigation/native';

export default function QuranScreen() {
	const [surahs, setSurahs] = useState<Surah[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const navigation = useNavigation<any>();

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const data = await quranService.getSurahs();
				setSurahs(data);
			} catch (e: any) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		})();
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={surahs}
				keyExtractor={(item) => String(item.number)}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.row} onPress={() => navigation.navigate('SurahDetail', { surah: item })}>
						<Text style={{ fontWeight: '700' }}>{item.number}. {item.englishName}</Text>
						<Text style={{ color: '#6b7280' }}>{item.name}</Text>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : error || 'No data'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	row: { padding: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
});