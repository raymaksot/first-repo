import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { apiGet, apiPost } from '@/services/api';
import { useNavigation } from '@react-navigation/native';

interface ReadingGroup {
	_id: string;
	name: string;
	description?: string;
	createdBy: string;
	createdAt: string;
}

export default function ReadingGroupsScreen() {
	const nav = useNavigation<any>();
	const [groups, setGroups] = useState<ReadingGroup[]>([]);
	const [loading, setLoading] = useState(false);
	const [modal, setModal] = useState(false);
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');

	async function load() {
		setLoading(true);
		try {
			const res = await apiGet<ReadingGroup[]>('/api/reading-groups');
			setGroups(res);
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		load();
	}, []);

	async function createGroup() {
		if (!name.trim()) return;
		const res = await apiPost<ReadingGroup>('/api/reading-groups', { name: name.trim(), description: description.trim() });
		setModal(false);
		setName('');
		setDescription('');
		setGroups([res, ...groups]);
	}

	return (
		<View style={styles.container}>
			<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
				<Text style={styles.title}>Reading Groups</Text>
				<TouchableOpacity style={styles.primary} onPress={() => setModal(true)}>
					<Text style={styles.primaryText}>Create</Text>
				</TouchableOpacity>
			</View>
			<FlatList
				data={groups}
				keyExtractor={(i) => i._id}
				renderItem={({ item }) => (
					<TouchableOpacity style={styles.card} onPress={() => nav.navigate('GroupDetail', { id: item._id })}>
						<Text style={{ fontWeight: '700' }}>{item.name}</Text>
						<Text numberOfLines={2} style={{ color: '#6b7280' }}>{item.description || '—'}</Text>
					</TouchableOpacity>
				)}
				ListEmptyComponent={<Text style={{ padding: 16 }}>{loading ? 'Loading…' : 'No groups yet'}</Text>}
			/>

			<Modal visible={modal} transparent animationType="slide">
				<View style={styles.modalWrap}>
					<View style={styles.modal}>
						<Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>New Group</Text>
						<TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
						<TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} />
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
							<TouchableOpacity onPress={() => setModal(false)} style={styles.secondary}><Text>Cancel</Text></TouchableOpacity>
							<TouchableOpacity onPress={createGroup} style={styles.primary}><Text style={styles.primaryText}>Create</Text></TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700' },
	card: { padding: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
	primary: { backgroundColor: '#0E7490', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	primaryText: { color: '#fff', fontWeight: '600' },
	secondary: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
	modal: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
	input: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },
});