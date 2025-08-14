import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHijriMonth } from '../services/api';
import { RootState } from '../store';
import { startLoading, setMonth, setEvents } from '../store/slices/calendarSlice';
import CalendarMonth from '../components/CalendarMonth';

export default function HijriCalendarScreen() {
	const dispatch = useDispatch();
	const { currentMonth, eventsById, loading } = useSelector((s: RootState) => s.calendar);
	const [selectedDay, setSelectedDay] = useState<number | null>(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			dispatch(startLoading());
			try {
				const data = await fetchHijriMonth();
				if (!mounted) return;
				dispatch(setMonth({
					yearHijri: data.yearHijri,
					monthHijri: data.monthHijri,
					startGregorian: data.days[0]?.gregorian || '',
					endGregorian: data.days[data.days.length - 1]?.gregorian || '',
					days: data.days.map((d) => ({ day: d.day, gregorian: d.gregorian, events: d.events?.map((e) => e.id) })),
				}));
				dispatch(setEvents(data.events.map((e) => ({ id: e.id, dateHijri: e.dateHijri, dateGregorian: e.dateGregorian, title: e.title, description: e.description, category: (e.category as any) || 'other' }))));
			} catch (e: any) {
				// handle via slice if needed
			} finally {
				//
			}
		})();
		return () => { mounted = false; };
	}, [dispatch]);

	const eventsForSelectedDay = useMemo(() => {
		if (!currentMonth || selectedDay == null) return [] as Array<{ id: string; title: string; description?: string }>;
		const day = currentMonth.days.find((d) => d.day === selectedDay);
		if (!day?.events?.length) return [];
		return day.events.map((id) => ({ id, title: eventsById[id]?.title, description: eventsById[id]?.description }));
	}, [currentMonth, selectedDay, eventsById]);

	return (
		<ScrollView contentContainerStyle={styles.container}>
			<Text style={styles.title}>Hijri Calendar</Text>
			{loading && <ActivityIndicator />}
			{currentMonth && (
				<CalendarMonth month={currentMonth} onDayPress={(d) => setSelectedDay(d)} />
			)}
			<Modal visible={selectedDay != null} transparent animationType="slide">
				<View style={styles.modalBackdrop}>
					<View style={styles.modalCard}>
						<Text style={styles.modalTitle}>Events</Text>
						{eventsForSelectedDay.length === 0 ? (
							<Text>No events</Text>
						) : (
							eventsForSelectedDay.map((ev) => (
								<View key={ev.id} style={{ marginBottom: 8 }}>
									<Text style={{ fontWeight: '600' }}>{ev.title}</Text>
									{!!ev.description && <Text>{ev.description}</Text>}
								</View>
							))
						)}
						<Pressable onPress={() => setSelectedDay(null)} style={styles.closeBtn}><Text style={{ color: 'white' }}>Close</Text></Pressable>
					</View>
				</View>
			</Modal>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16 },
	title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
	modalCard: { backgroundColor: 'white', width: '85%', borderRadius: 12, padding: 16 },
	modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
	closeBtn: { backgroundColor: '#0ea5e9', paddingVertical: 8, borderRadius: 8, alignItems: 'center', marginTop: 12 },
});