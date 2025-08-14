import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { ENV } from '@/config/env';
import { api } from '@/services/api';
import QiblaCompass from './QiblaCompass';

interface Place { id: string; name: string; lat: number; lng: number; type: 'mosque' | 'restaurant'; address?: string; }

export default function PlacesScreen() {
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
	const [places, setPlaces] = useState<Place[]>([]);
	const [selectedType, setSelectedType] = useState<'mosque' | 'restaurant'>('mosque');

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') return;
			const loc = await Location.getCurrentPositionAsync({});
			const lat = loc.coords.latitude;
			const lng = loc.coords.longitude;
			setCoords({ lat, lng });
			await fetchPlaces(lat, lng, selectedType);
		})();
	}, []);

	async function fetchPlaces(lat: number, lng: number, type: 'mosque' | 'restaurant') {
		try {
			if (ENV.googleMapsApiKey) {
				const radius = 3000;
				const keyword = type === 'mosque' ? 'mosque' : 'halal restaurant';
				const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${ENV.googleMapsApiKey}`;
				const res = await fetch(url);
				const json = await res.json();
				const mapped: Place[] = (json.results || []).map((r: any) => ({ id: r.place_id, name: r.name, lat: r.geometry.location.lat, lng: r.geometry.location.lng, type, address: r.vicinity }));
				setPlaces(mapped);
			} else {
				const res = await api.get('/api/places/nearby', { params: { lat, lng, type } });
				setPlaces(res.data);
			}
		} catch (e) {}
	}

	async function onChangeType(t: 'mosque' | 'restaurant') {
		if (!coords) return;
		setSelectedType(t);
		await fetchPlaces(coords.lat, coords.lng, t);
	}

	return (
		<View style={styles.container}>
			<View style={styles.toggleRow}>
				<TouchableOpacity style={[styles.toggle, selectedType === 'mosque' && styles.toggleActive]} onPress={() => onChangeType('mosque')}>
					<Text style={[styles.toggleText, selectedType === 'mosque' && styles.toggleTextActive]}>Mosques</Text>
				</TouchableOpacity>
				<TouchableOpacity style={[styles.toggle, selectedType === 'restaurant' && styles.toggleActive]} onPress={() => onChangeType('restaurant')}>
					<Text style={[styles.toggleText, selectedType === 'restaurant' && styles.toggleTextActive]}>Halal Food</Text>
				</TouchableOpacity>
			</View>
			<QiblaCompass />
			{coords && (
				<MapView style={styles.map} initialRegion={{ latitude: coords.lat, longitude: coords.lng, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
					<Marker coordinate={{ latitude: coords.lat, longitude: coords.lng }} title="You" />
					{places.map((p) => (
						<Marker key={p.id} coordinate={{ latitude: p.lat, longitude: p.lng }} title={p.name} description={p.address} />
					))}
				</MapView>
			)}
			<FlatList
				data={places}
				keyExtractor={(i) => i.id}
				renderItem={({ item }) => (
					<View style={styles.row}>
						<Text style={{ fontWeight: '600' }}>{item.name}</Text>
						<Text style={{ color: '#6b7280' }}>{item.address}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1 },
	toggleRow: { flexDirection: 'row', padding: 12, gap: 8 },
	toggle: { flex: 1, paddingVertical: 8, backgroundColor: '#f3f4f6', borderRadius: 8, alignItems: 'center' },
	toggleActive: { backgroundColor: '#0E7490' },
	toggleText: { color: '#111827' },
	toggleTextActive: { color: '#fff' },
	map: { height: 220 },
	row: { padding: 16, borderBottomColor: '#e5e7eb', borderBottomWidth: 1 },
});