import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { duasService, DuaCategory, Dua } from '@/services/duasService';
import { Audio } from 'expo-av';

export default function DuasScreen() {
	const [categories, setCategories] = useState<DuaCategory[]>([]);
	const [selected, setSelected] = useState<string | null>(null);
	const [items, setItems] = useState<Dua[]>([]);
	const [counter, setCounter] = useState(0);
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	useEffect(() => {
		(async () => {
			const cats = await duasService.getCategories();
			setCategories(cats);
			if (cats[0]?._id) {
				setSelected(cats[0]._id);
				const res = await duasService.getByCategory(cats[0]._id);
				setItems(res);
			}
		})();
		return () => {
			if (sound) sound.unloadAsync();
		};
	}, []);

	async function onSelectCategory(id: string) {
		setSelected(id);
		const res = await duasService.getByCategory(id);
		setItems(res);
	}

	async function playAudio(url?: string) {
		if (!url) return;
		if (sound) await sound.unloadAsync();
		const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
		setSound(newSound);
		await newSound.playAsync();
	}

	return (
		<View style={styles.container}>
			<FlatList
				horizontal
				data={categories}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<TouchableOpacity style={[styles.chip, selected === item._id && styles.chipActive]} onPress={() => onSelectCategory(item._id)}>
						<Text style={[styles.chipText, selected === item._id && styles.chipTextActive]}>{item.name}</Text>
					</TouchableOpacity>
				)}
				style={{ maxHeight: 50, marginVertical: 8 }}
			/>

			<FlatList
				data={items}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<View style={styles.duaRow}>
						<Text style={{ fontWeight: '600' }}>{item.title}</Text>
						<Text style={{ textAlign: 'right', fontSize: 18 }}>{item.arabic}</Text>
						{item.translation ? <Text style={{ color: '#6b7280' }}>{item.translation}</Text> : null}
						<View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
							<TouchableOpacity style={styles.btn} onPress={() => setCounter(counter + 1)}>
								<Text style={styles.btnText}>Dhikr + ({counter})</Text>
							</TouchableOpacity>
							<TouchableOpacity style={styles.btn} onPress={() => playAudio(item.audioUrl)}>
								<Text style={styles.btnText}>Play</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>No duas</Text>}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f3f4f6', marginRight: 8 },
	chipActive: { backgroundColor: '#0E7490' },
	chipText: { color: '#111827' },
	chipTextActive: { color: '#fff' },
	duaRow: { paddingVertical: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
	btn: { backgroundColor: '#0E7490', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
	btnText: { color: '#fff' },
});