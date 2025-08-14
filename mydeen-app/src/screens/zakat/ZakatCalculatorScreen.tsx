import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

export default function ZakatCalculatorScreen() {
	const [cash, setCash] = useState('');
	const [gold, setGold] = useState('');
	const [silver, setSilver] = useState('');

	const total = (parseFloat(cash) || 0) + (parseFloat(gold) || 0) + (parseFloat(silver) || 0);
	const zakat = total * 0.025;

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Zakat Calculator</Text>
			<TextInput placeholder="Cash and savings" keyboardType="decimal-pad" style={styles.input} value={cash} onChangeText={setCash} />
			<TextInput placeholder="Gold value" keyboardType="decimal-pad" style={styles.input} value={gold} onChangeText={setGold} />
			<TextInput placeholder="Silver value" keyboardType="decimal-pad" style={styles.input} value={silver} onChangeText={setSilver} />
			<Text>Total: {total.toFixed(2)}</Text>
			<Text>Zakat (2.5%): {zakat.toFixed(2)}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
	input: { borderColor: '#e5e7eb', borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 12 },
});