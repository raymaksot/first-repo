import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { hadithService, Hadith } from '@/services/hadithService';

export default function HadithScreen() {
	const [query, setQuery] = useState('');
	const [page, setPage] = useState(1);
	const [items, setItems] = useState<Hadith[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	async function search(reset = true) {
		if (loading) return;
		setLoading(true);
		try {
			const nextPage = reset ? 1 : page + 1;
			const res = await hadithService.search(query, nextPage, 20);
			setItems(reset ? res.data : [...items, ...res.data]);
			setPage(nextPage);
			setHasMore(res.data.length > 0 && nextPage * 20 < res.total);
		} catch (e) {
			// handle
		} finally {
			setLoading(false);
		}
	}

	return (
		<View style={styles.container}>
			<View style={styles.searchBar}>
				<TextInput placeholder="Search hadith" value={query} onChangeText={setQuery} style={styles.input} />
				<TouchableOpacity style={styles.btn} onPress={() => search(true)}>
					<Text style={{ color: '#fff' }}>Go</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={items}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={{ fontWeight: '600' }}>{item.collection} #{item.number || ''}</Text>
						<Text>{item.translation || item.text}</Text>
					</View>
				)}
				onEndReachedThreshold={0.3}
				onEndReached={() => hasMore && !loading && search(false)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : 'No results'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	searchBar: { flexDirection: 'row', marginBottom: 12 },
	input: { flex: 1, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12 },
	btn: { marginLeft: 8, backgroundColor: '#0E7490', paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
	row: { paddingVertical: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
});