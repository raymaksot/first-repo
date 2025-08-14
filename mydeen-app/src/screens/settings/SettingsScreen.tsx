import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setThemeMode, setLocale } from '@/store/preferencesSlice';
import { logout } from '@/store/authSlice';

export default function SettingsScreen() {
	const dispatch = useAppDispatch();
	const themeMode = useAppSelector((s) => s.preferences.themeMode);
	const locale = useAppSelector((s) => s.preferences.locale);
	return (
		<View style={styles.container}>
			<View style={styles.row}>
				<Text style={styles.label}>Dark Mode</Text>
				<Switch value={themeMode === 'dark'} onValueChange={(v) => dispatch(setThemeMode(v ? 'dark' : 'light'))} />
			</View>
			<View style={styles.row}>
				<Text style={styles.label}>Locale</Text>
				<View style={{ flexDirection: 'row', gap: 12 }}>
					<TouchableOpacity onPress={() => dispatch(setLocale('en'))}><Text style={locale === 'en' ? styles.active : undefined}>EN</Text></TouchableOpacity>
					<TouchableOpacity onPress={() => dispatch(setLocale('ar'))}><Text style={locale === 'ar' ? styles.active : undefined}>AR</Text></TouchableOpacity>
				</View>
			</View>
			<TouchableOpacity style={styles.logout} onPress={() => dispatch(logout())}>
				<Text style={{ color: '#fff', textAlign: 'center' }}>Logout</Text>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, padding: 16 },
	row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
	label: { fontSize: 16 },
	active: { fontWeight: '700', color: '#0E7490' },
	logout: { marginTop: 24, backgroundColor: '#ef4444', paddingVertical: 12, borderRadius: 8 },
});