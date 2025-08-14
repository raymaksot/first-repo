import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Magnetometer } from 'expo-sensors';

function calculateHeading({ x, y, z }: { x: number; y: number; z: number }) {
	let angle = 0;
	if (Math.atan2) angle = Math.atan2(y, x) * (180 / Math.PI);
	else angle = 0;
	return angle >= 0 ? angle : angle + 360;
}

export default function QiblaCompass() {
	const [heading, setHeading] = useState(0);
	useEffect(() => {
		Magnetometer.setUpdateInterval(200);
		const sub = Magnetometer.addListener((data) => {
			setHeading(calculateHeading(data));
		});
		return () => sub && sub.remove();
	}, []);
	return (
		<View style={styles.container}>
			<Text style={styles.text}>Heading: {heading.toFixed(0)}°</Text>
			<Text style={styles.text}>Point to 118° (approx. from North) to face Qibla</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { alignItems: 'center', padding: 16 },
	text: { color: '#111827' },
});