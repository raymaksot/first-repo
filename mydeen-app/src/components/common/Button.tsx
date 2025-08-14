import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';

interface Props {
	title: string;
	onPress: () => void;
	loading?: boolean;
	style?: ViewStyle;
}

export default function Button({ title, onPress, loading, style }: Props) {
	return (
		<TouchableOpacity style={[styles.btn, style]} onPress={onPress} disabled={!!loading}>
			{loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>{title}</Text>}
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	btn: {
		backgroundColor: '#0E7490',
		paddingVertical: 12,
		borderRadius: 8,
		alignItems: 'center',
	},
	text: {
		color: '#fff',
		fontWeight: '600',
		fontSize: 16,
	},
});