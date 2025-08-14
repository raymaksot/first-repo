import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { apiGet, apiPost } from '@/services/api';
import { useRoute } from '@react-navigation/native';
import { useAppSelector } from '@/store/hooks';

interface Member { userId: string; role: 'owner' | 'member' }
interface Group { _id: string; name: string; description?: string }
interface Progress { _id: string; userId: string; surah: number; fromAyah: number; toAyah: number; completed: boolean }
interface Message { _id: string; userId: string; text: string; createdAt: string }

export default function GroupDetailScreen() {
	const route = useRoute<any>();
	const id = route.params?.id as string;
	const user = useAppSelector((s) => s.auth.user);
	const [group, setGroup] = useState<Group | null>(null);
	const [members, setMembers] = useState<Member[]>([]);
	const [progress, setProgress] = useState<Progress[]>([]);
	const [messages, setMessages] = useState<Message[]>([]);
	const [msg, setMsg] = useState('');

	useEffect(() => {
		(async () => {
			const res = await apiGet<{ group: Group; members: Member[] }>(`/api/reading-groups/${id}`);
			setGroup(res.group);
			setMembers(res.members);
			const p = await apiGet<Progress[]>(`/api/reading-groups/${id}/progress`);
			setProgress(p);
			const m = await apiGet<Message[]>(`/api/reading-groups/${id}/messages`);
			setMessages(m);
		})();
	}, [id]);

	async function sendMessage() {
		const text = msg.trim();
		if (!text) return;
		const m = await apiPost<Message>(`/api/reading-groups/${id}/messages`, { text });
		setMessages([m, ...messages]);
		setMsg('');
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{group?.name}</Text>
			<Text style={{ color: '#6b7280' }}>{group?.description}</Text>

			<Text style={styles.section}>Members</Text>
			<FlatList data={members} keyExtractor={(i) => i.userId} renderItem={({ item }) => <Text>- {item.userId} {item.role === 'owner' ? '(Owner)' : ''}</Text>} />

			<Text style={styles.section}>Progress</Text>
			<FlatList data={progress} keyExtractor={(i) => i._id} renderItem={({ item }) => <Text>Surah {item.surah}: {item.fromAyah}-{item.toAyah} {item.completed ? '✅' : '⬜'}</Text>} />

			<Text style={styles.section}>Chat</Text>
			<FlatList data={messages} keyExtractor={(i) => i._id} renderItem={({ item }) => <Text>{item.userId}: {item.text}</Text>} />
			<View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
				<TextInput value={msg} onChangeText={setMsg} placeholder="Message" style={styles.input} />
				<TouchableOpacity onPress={sendMessage} style={styles.primary}><Text style={styles.primaryText}>Send</Text></TouchableOpacity>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
	section: { marginTop: 12, fontWeight: '700' },
	input: { flex: 1, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 10 },
	primary: { backgroundColor: '#0E7490', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	primaryText: { color: '#fff', fontWeight: '600' },
});