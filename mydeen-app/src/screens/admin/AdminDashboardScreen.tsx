import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { apiGet, apiPost, apiDelete } from '@/services/api';
import { useAppSelector } from '@/store/hooks';

export default function AdminDashboardScreen() {
	const user = useAppSelector((s) => s.auth.user);
	const [stats, setStats] = useState<{ pendingComments: number; groups: number; events: number } | null>(null);
	const [pendingComments, setPendingComments] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			try {
				const data = await apiGet('/api/admin/dashboard');
				setStats(data);
			} catch {}
		})();
	}, []);

	async function loadPending() {
		// This endpoint is not defined; for demo, we will skip fetching list
	}

	if (!user || user.role !== 'admin') {
		return (
			<View style={styles.container}><Text>Forbidden</Text></View>
		);
	}
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Admin</Text>
			<Text>Pending comments: {stats?.pendingComments ?? 0}</Text>
			<Text>Total groups: {stats?.groups ?? 0}</Text>
			<Text>Total events: {stats?.events ?? 0}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
});