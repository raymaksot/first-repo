import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { qaService, QAItem } from '@/services/qaService';
import { useNavigation } from '@react-navigation/native';

export default function QAScreen() {
	const navigation = useNavigation<any>();
	const [items, setItems] = useState<QAItem[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	async function load(reset = false) {
		if (loading) return;
		setLoading(true);
		try {
			const next = reset ? 1 : page + 1;
			const res = await qaService.list(next, 20);
			setItems(reset ? res.data : [...items, ...res.data]);
			setPage(next);
			setHasMore(next * 20 < res.total);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load(true);
	}, []);

	return (
		<View style={styles.container}>
			<FlatList
				data={items}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.row} onPress={() => navigation.navigate('QADetail', { id: item._id })}>
						<Text style={{ fontWeight: '700' }}>{item.title}</Text>
						<Text numberOfLines={2} style={{ color: '#6b7280' }}>{item.question}</Text>
					</TouchableOpacity>
				)}
				onEndReachedThreshold={0.3}
				onEndReached={() => hasMore && !loading && load(false)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : 'No questions'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	row: { padding: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
});