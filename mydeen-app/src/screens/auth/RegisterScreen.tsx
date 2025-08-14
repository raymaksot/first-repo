import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/authSlice';

export default function RegisterScreen() {
	const dispatch = useAppDispatch();
	const status = useAppSelector((s) => s.auth.status);
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Create Account</Text>
			<TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
			<TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
			<TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
			<Button title="Register" onPress={() => dispatch(register({ name, email, password }))} loading={status === 'loading'} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 16 },
	title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
	input: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 12,
	},
});