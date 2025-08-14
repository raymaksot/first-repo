import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '@/components/common/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, googleLogin } from '@/store/authSlice';
import * as Google from 'expo-auth-session/providers/google';
import { ENV } from '@/config/env';

export default function LoginScreen() {
	const dispatch = useAppDispatch();
	const status = useAppSelector((s) => s.auth.status);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [request, response, promptAsync] = Google.useAuthRequest({
		webClientId: ENV.googleWebClientId,
	});

	React.useEffect(() => {
		if (response?.type === 'success') {
			const idToken = response.authentication?.idToken;
			if (idToken) dispatch(googleLogin(idToken));
		}
	}, [response]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>MyDeen</Text>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				style={styles.input}
				keyboardType="email-address"
				autoCapitalize="none"
			/>
			<TextInput
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				style={styles.input}
				secureTextEntry
			/>
			<Button title="Login" onPress={() => dispatch(login({ email, password }))} loading={status === 'loading'} />
			<View style={{ height: 12 }} />
			<Button title="Continue with Google" onPress={() => promptAsync()} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, justifyContent: 'center', padding: 16 },
	title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
	input: {
		borderWidth: 1,
		borderColor: '#e5e7eb',
		borderRadius: 8,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 12,
	},
});