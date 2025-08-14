import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export function TermsScreen() {
	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
			<Text style={styles.title}>Terms of Service</Text>
			<Text>By using MyDeen, you agree to our terms...</Text>
		</ScrollView>
	);
}

export function PrivacyScreen() {
	return (
		<ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
			<Text style={styles.title}>Privacy Policy</Text>
			<Text>We respect your privacy...</Text>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	title: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
});