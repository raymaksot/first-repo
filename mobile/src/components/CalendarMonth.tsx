import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { HijriMonthData } from '../store/slices/calendarSlice';

interface Props {
	month: HijriMonthData;
	onDayPress?: (day: number) => void;
}

export default function CalendarMonth({ month, onDayPress }: Props) {
	const totalDays = month.days.length;
	const weeks: Array<Array<{ day: number; gregorian: string; hasEvent: boolean }>> = [];
	let currentWeek: Array<{ day: number; gregorian: string; hasEvent: boolean }> = [];
	for (let i = 0; i < totalDays; i++) {
		const d = month.days[i];
		currentWeek.push({ day: d.day, gregorian: d.gregorian, hasEvent: Boolean(d.events?.length) });
		if (currentWeek.length === 7) {
			weeks.push(currentWeek);
			currentWeek = [];
		}
	}
	if (currentWeek.length) weeks.push(currentWeek);

	return (
		<View style={styles.container}>
			<View style={styles.headerRow}>
				{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
					<Text key={d} style={styles.headerText}>{d}</Text>
				))}
			</View>
			{weeks.map((week, idx) => (
				<View style={styles.weekRow} key={idx}>
					{week.map((d) => (
						<TouchableOpacity key={d.day} style={[styles.dayCell, d.hasEvent && styles.dayHasEvent]} onPress={() => onDayPress?.(d.day)}>
							<Text style={styles.hijriText}>{d.day}</Text>
							<Text style={styles.gregText}>{new Date(d.gregorian).getDate()}</Text>
						</TouchableOpacity>
					))}
				</View>
			))}
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 12 },
	headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
	headerText: { width: `${100 / 7}%`, textAlign: 'center', fontWeight: '600' },
	weekRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
	dayCell: { width: `${100 / 7}%`, borderRadius: 8, paddingVertical: 8, alignItems: 'center', backgroundColor: '#f5f5f5' },
	dayHasEvent: { backgroundColor: '#e0f2fe', borderWidth: 1, borderColor: '#0284c7' },
	hijriText: { fontWeight: '700' },
	gregText: { fontSize: 10, color: '#6b7280' },
});