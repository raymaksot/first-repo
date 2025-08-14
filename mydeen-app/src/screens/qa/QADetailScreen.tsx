import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { qaService, QAItem } from '@/services/qaService';
import { useAppSelector } from '@/store/hooks';
import { CommentsThread } from '@/components/CommentsThread';
import { useOfflineSync } from '@/offline/useOfflineSync';

export default function QADetailScreen() {
	const route = useRoute<any>();
	const id = route.params?.id as string;
	const [item, setItem] = useState<QAItem | null>(null);
	const [answer, setAnswer] = useState('');
	const [loading, setLoading] = useState(false);
	const user = useAppSelector((s) => s.auth.user);
	const [answerLikes, setAnswerLikes] = useState(0);
	const { pending } = useOfflineSync();

	useEffect(() => {
		(async () => {
			const res = await qaService.get(id);
			setItem(res);
		})();
	}, [id]);

	async function submit() {
		if (!answer.trim()) return;
		setLoading(true);
		try {
			const updated = await qaService.answer(id, answer.trim());
			setItem(updated);
			setAnswer('');
		} finally {
			setLoading(false);
		}
	}

	const canAnswer = user?.role === 'scholar' || user?.role === 'admin';

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{item?.title}</Text>
			<Text style={styles.q}>{item?.question}</Text>
			<Text style={styles.section}>Answer</Text>
			<Text>{item?.answer || 'Not answered yet'}</Text>
			<View style={{ marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
				<TouchableOpacity onPress={() => setAnswerLikes((n) => n + 1)} style={styles.likeBtn}>
					<Text>Like answer</Text>
				</TouchableOpacity>
				<Text>{answerLikes} likes</Text>
			</View>
			{canAnswer && (
				<View style={{ marginTop: 12 }}>
					<TextInput value={answer} onChangeText={setAnswer} placeholder="Write your answer" style={styles.input} multiline />
					<TouchableOpacity style={styles.btn} onPress={submit} disabled={loading}>
						<Text style={styles.btnText}>{loading ? 'Submitting…' : 'Submit'}</Text>
					</TouchableOpacity>
				</View>
			)}
			<Text style={styles.section}>Comments {pending ? `(queue: ${pending})` : ''}</Text>
			{item?._id ? (
				<CommentsThread parentType="qaAnswer" parentId={item._id} canEdit={(c) => c.userId === user?._id || user?.role === 'admin'} />
			) : null}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
	q: { marginBottom: 12 },
	section: { fontSize: 16, fontWeight: '700', marginTop: 12, marginBottom: 8 },
	input: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 12, minHeight: 80 },
	btn: { marginTop: 8, backgroundColor: '#0E7490', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
	btnText: { color: '#fff', fontWeight: '600' },
	likeBtn: { backgroundColor: '#f3f4f6', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8 },
});