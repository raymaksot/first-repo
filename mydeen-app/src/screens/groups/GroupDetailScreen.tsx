import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal } from 'react-native';
import { apiGet, apiPost } from '@/services/api';
import { useRoute } from '@react-navigation/native';
import { useAppSelector } from '@/store/hooks';
import { groupsService } from '@/services/groupsService';
import { enqueue } from '@/offline/mutationQueue';

interface Member { userId: string; role: 'owner' | 'member' }
interface Group { _id: string; name: string; description?: string; createdBy: string }
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
	const [assignModal, setAssignModal] = useState(false);
	const [surah, setSurah] = useState('');
	const [fromAyah, setFromAyah] = useState('');
	const [toAyah, setToAyah] = useState('');

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

	async function assignReading() {
		const surahNum = parseInt(surah.trim());
		const fromAyahNum = parseInt(fromAyah.trim());
		const toAyahNum = parseInt(toAyah.trim());
		
		if (!surahNum || !fromAyahNum || !toAyahNum || fromAyahNum > toAyahNum) {
			return;
		}

		try {
			const newProgress = await groupsService.setProgress(id, {
				surah: surahNum,
				fromAyah: fromAyahNum,
				toAyah: toAyahNum,
				completed: false
			});
			setProgress([newProgress, ...progress]);
		} catch (error) {
			// Network unavailable, queue for later sync
			await enqueue('setGroupProgress', {
				groupId: id,
				surah: surahNum,
				fromAyah: fromAyahNum,
				toAyah: toAyahNum,
				completed: false
			});
		}

		setAssignModal(false);
		setSurah('');
		setFromAyah('');
		setToAyah('');
	}

	async function toggleProgress(item: Progress) {
		const updatedCompleted = !item.completed;
		try {
			const updatedProgress = await groupsService.setProgress(id, {
				surah: item.surah,
				fromAyah: item.fromAyah,
				toAyah: item.toAyah,
				completed: updatedCompleted
			});
			setProgress(progress.map(p => p._id === item._id ? updatedProgress : p));
		} catch (error) {
			// Network unavailable, queue for later sync
			await enqueue('setGroupProgress', {
				groupId: id,
				surah: item.surah,
				fromAyah: item.fromAyah,
				toAyah: item.toAyah,
				completed: updatedCompleted
			});
			// Optimistically update UI
			setProgress(progress.map(p => p._id === item._id ? { ...p, completed: updatedCompleted } : p));
		}
	}

	const isOwner = user && group && user._id === group.createdBy;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{group?.name}</Text>
			<Text style={{ color: '#6b7280' }}>{group?.description}</Text>

			<Text style={styles.section}>Members</Text>
			<FlatList data={members} keyExtractor={(i) => i.userId} renderItem={({ item }) => <Text>- {item.userId} {item.role === 'owner' ? '(Owner)' : ''}</Text>} />

			<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
				<Text style={styles.section}>Progress</Text>
				{isOwner && (
					<TouchableOpacity onPress={() => setAssignModal(true)} style={styles.primary}>
						<Text style={styles.primaryText}>Assign Reading</Text>
					</TouchableOpacity>
				)}
			</View>
			<FlatList 
				data={progress} 
				keyExtractor={(i) => i._id} 
				renderItem={({ item }) => (
					<TouchableOpacity 
						style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}
						onPress={() => toggleProgress(item)}
					>
						<Text style={{ marginRight: 8 }}>{item.completed ? '✅' : '⬜'}</Text>
						<Text>Surah {item.surah}: {item.fromAyah}-{item.toAyah}</Text>
					</TouchableOpacity>
				)} 
			/>

			<Text style={styles.section}>Chat</Text>
			<FlatList data={messages} keyExtractor={(i) => i._id} renderItem={({ item }) => <Text>{item.userId}: {item.text}</Text>} />
			<View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
				<TextInput value={msg} onChangeText={setMsg} placeholder="Message" style={styles.input} />
				<TouchableOpacity onPress={sendMessage} style={styles.primary}><Text style={styles.primaryText}>Send</Text></TouchableOpacity>
			</View>

			<Modal visible={assignModal} transparent animationType="slide">
				<View style={styles.modalWrap}>
					<View style={styles.modal}>
						<Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>Assign Reading</Text>
						<TextInput 
							placeholder="Surah number" 
							value={surah} 
							onChangeText={setSurah} 
							style={styles.modalInput}
							keyboardType="numeric"
						/>
						<TextInput 
							placeholder="From Ayah" 
							value={fromAyah} 
							onChangeText={setFromAyah} 
							style={styles.modalInput}
							keyboardType="numeric"
						/>
						<TextInput 
							placeholder="To Ayah" 
							value={toAyah} 
							onChangeText={setToAyah} 
							style={styles.modalInput}
							keyboardType="numeric"
						/>
						<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 8 }}>
							<TouchableOpacity onPress={() => setAssignModal(false)} style={styles.secondary}>
								<Text>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={assignReading} style={styles.primary}>
								<Text style={styles.primaryText}>Assign</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
	section: { marginTop: 12, fontWeight: '700' },
	input: { flex: 1, borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 10 },
	modalInput: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 8 },
	primary: { backgroundColor: '#0E7490', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	primaryText: { color: '#fff', fontWeight: '600' },
	secondary: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	modalWrap: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'flex-end' },
	modal: { backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 12, borderTopRightRadius: 12 },
});