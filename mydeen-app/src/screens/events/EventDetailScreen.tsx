import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { apiDelete, apiGet, apiPost } from '@/services/api';
import * as Notifications from 'expo-notifications';
import { useRoute } from '@react-navigation/native';

interface EventDetail { _id: string; title: string; startsAt: string; endsAt?: string; location?: string; description?: string; registrationsCount?: number }

export default function EventDetailScreen() {
	const route = useRoute<any>();
	const id = route.params?.id as string;
	const [item, setItem] = useState<EventDetail | null>(null);
	const [registered, setRegistered] = useState(false);
	const [count, setCount] = useState<number>(0);

	useEffect(() => {
		(async () => {
			const res = await apiGet<EventDetail>(`/api/events/${id}`);
			setItem(res);
			setCount(res.registrationsCount ?? 0);
		})();
	}, [id]);

	async function register() {
		const r = await apiPost<{ registered: boolean; registrationsCount: number }>(`/api/events/${id}/register`);
		setRegistered(true);
		setCount(r.registrationsCount ?? count);
		// Local reminder 30 mins before
		if (item?.startsAt) {
			const when = new Date(new Date(item.startsAt).getTime() - 30 * 60 * 1000);
			if (when.getTime() > Date.now()) {
				await Notifications.scheduleNotificationAsync({
					content: { title: 'Event Reminder', body: `${item.title} starts soon` },
					trigger: { date: when },
				});
			}
		}
	}

	async function cancel() {
		const r = await apiDelete<{ registered: boolean; registrationsCount: number }>(`/api/events/${id}/register`);
		setRegistered(false);
		setCount(r.registrationsCount ?? Math.max(0, count - 1));
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>{item?.title}</Text>
			{item?.startsAt ? <Text>{new Date(item.startsAt).toLocaleString()}</Text> : null}
			{item?.location ? <Text>{item.location}</Text> : null}
			{item?.description ? <Text style={{ marginTop: 8 }}>{item.description}</Text> : null}
			<Text style={{ marginTop: 8, color: '#6b7280' }}>Registrations: {count}</Text>
			<View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
				{registered ? (
					<TouchableOpacity onPress={cancel} style={styles.secondary}><Text>Cancel RSVP</Text></TouchableOpacity>
				) : (
					<TouchableOpacity onPress={register} style={styles.primary}><Text style={styles.primaryText}>RSVP</Text></TouchableOpacity>
				)}
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
	primary: { backgroundColor: '#0E7490', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
	primaryText: { color: '#fff', fontWeight: '600' },
	secondary: { backgroundColor: '#f3f4f6', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 12 },
});