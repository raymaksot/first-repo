import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CommentsThread } from '@/components/CommentsThread';
import { useOfflineSync } from '@/offline/useOfflineSync';

export default function ArticleDetailScreen() {
	const [likes, setLikes] = useState(0);
	const articleId = 'demo-article-id';
	const { pending } = useOfflineSync();
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Article</Text>
			<Text>Coming soon…</Text>
			<View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
				<TouchableOpacity onPress={() => setLikes((n) => n + 1)} style={styles.likeBtn}>
					<Text>Like</Text>
				</TouchableOpacity>
				<Text>{likes} likes</Text>
			</View>
			<Text style={styles.section}>Comments {pending ? `(queue: ${pending})` : ''}</Text>
			<CommentsThread parentType="article" parentId={articleId} canEdit={() => true} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	likeBtn: { backgroundColor: '#f3f4f6', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 },
	section: { fontSize: 16, fontWeight: '700', marginTop: 16, marginBottom: 8 },
});