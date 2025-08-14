import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RamadanCountdown from '../components/RamadanCountdown';
import { downloadAllDatasets, observeNetwork } from '../services/offline';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setDownloadStatus, setLastDownloadedAt, setOffline } from '../store/slices/offlineSlice';

export default function HomeScreen() {
	const navigation = useNavigation<any>();
	const dispatch = useDispatch();
	const offline = useSelector((s: RootState) => s.offline);
	const [downloadToggle, setDownloadToggle] = useState(false);

	useEffect(() => {
		const unsub = observeNetwork((isOffline) => dispatch(setOffline(isOffline)));
		return () => { unsub(); };
	}, [dispatch]);

	useEffect(() => {
		if (downloadToggle && offline.downloadStatus !== 'downloading') {
			dispatch(setDownloadStatus('downloading'));
			downloadAllDatasets()
				.then(() => {
					dispatch(setDownloadStatus('complete'));
					dispatch(setLastDownloadedAt(Date.now()));
					Alert.alert('Offline', 'Datasets downloaded');
				})
				.catch((e) => {
					dispatch(setDownloadStatus('error'));
					Alert.alert('Offline', 'Download failed');
				});
		}
	}, [downloadToggle, offline.downloadStatus, dispatch]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Home</Text>
			<View style={styles.row}><RamadanCountdown /></View>
			<View style={styles.row}>
				<Text style={{ flex: 1 }}>Download for offline use</Text>
				<Switch value={downloadToggle} onValueChange={setDownloadToggle} />
			</View>
			<Text style={{ marginBottom: 8 }}>Status: {offline.isOffline ? 'Offline' : 'Online'} | Download: {offline.downloadStatus}</Text>
			<View style={styles.links}>
				<Pressable style={styles.link} onPress={() => navigation.navigate('HijriCalendar')}><Text>Hijri Calendar</Text></Pressable>
				<Pressable style={styles.link} onPress={() => navigation.navigate('Zakat')}><Text>Zakat</Text></Pressable>
				<Pressable style={styles.link} onPress={() => navigation.navigate('Search')}><Text>Search</Text></Pressable>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, flex: 1 },
	title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	row: { marginBottom: 12 },
	links: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	link: { padding: 12, backgroundColor: '#f3f4f6', borderRadius: 8 },
});