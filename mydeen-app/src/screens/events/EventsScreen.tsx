import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { apiGet } from '@/services/api';
import { useNavigation } from '@react-navigation/native';

interface EventItem { _id: string; title: string; startsAt: string; endsAt?: string; location?: string; description?: string }

export default function EventsScreen() {
	const nav = useNavigation<any>();
	const [items, setItems] = useState<EventItem[]>([]);
	const [loading, setLoading] = useState(false);

	async function load() {
		setLoading(true);
		try {
			const res = await apiGet<EventItem[]>('/api/events');
			setItems(res);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Events</Text>
			<FlatList
				data={items}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.card} onPress={() => nav.navigate('EventDetail', { id: item._id })}>
						<Text style={{ fontWeight: '700' }}>{item.title}</Text>
						<Text style={{ color: '#6b7280' }}>{new Date(item.startsAt).toLocaleString()}</Text>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : 'No events'}</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
	card: { padding: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
});