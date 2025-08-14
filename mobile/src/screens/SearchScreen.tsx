import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, FlatList } from 'react-native';
import { ClientSearch } from '../services/search';
import { getDataset } from '../services/offline';
import { fetchQuranAll, fetchHadithAll } from '../services/api';

const search = new ClientSearch();

export default function SearchScreen() {
	const [query, setQuery] = useState('');
	const [lang, setLang] = useState<string | undefined>(undefined);
	const [surah, setSurah] = useState<number | undefined>(undefined);
	const [collection, setCollection] = useState<string | undefined>(undefined);
	const [results, setResults] = useState<any[]>([]);

	useEffect(() => {
		(async () => {
			const quran = (await getDataset<any[]>('quran')) || (await fetchQuranAll());
			const hadith = (await getDataset<any[]>('hadith')) || (await fetchHadithAll());
			search.indexQuran(quran.map((a) => ({ id: `${a.surah}:${a.ayah}`, surah: a.surah, ayah: a.ayah, text: a.text, lang: a.lang })));
			search.indexHadith(hadith.map((h) => ({ id: `${h.collection}:${h.number}`, collection: h.collection, number: String(h.number), text: h.text, lang: h.lang })));
		})();
	}, []);

	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			return;
		}
		const qResults = search.searchQuran(query, { surah, lang });
		const hResults = search.searchHadith(query, { collection, lang });
		setResults([
			...qResults.map((r) => ({ type: 'quran', id: r.id, title: `Surah ${r.surah}:${r.ayah}`, text: r.text })),
			...hResults.map((r) => ({ type: 'hadith', id: r.id, title: `${r.collection} ${r.number}`, text: r.text })),
		]);
	}, [query, lang, surah, collection]);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Search</Text>
			<TextInput placeholder="Query" value={query} onChangeText={setQuery} style={styles.input} />
			<View style={styles.filters}>
				<TextInput placeholder="Lang (en, ar)" value={lang || ''} onChangeText={(t) => setLang(t || undefined)} style={styles.inputSmall} />
				<TextInput placeholder="Surah #" keyboardType="numeric" value={surah ? String(surah) : ''} onChangeText={(t) => setSurah(t ? Number(t) : undefined)} style={styles.inputSmall} />
				<TextInput placeholder="Collection" value={collection || ''} onChangeText={(t) => setCollection(t || undefined)} style={styles.inputSmall} />
			</View>
			<FlatList
				data={results}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<View style={styles.resultItem}>
						<Text style={styles.resultTitle}>{item.title}</Text>
						<Text numberOfLines={3} style={styles.resultText}>{item.text}</Text>
					</View>
				)}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: { padding: 16, flex: 1 },
	title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
	input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 8, marginBottom: 8 },
	filters: { flexDirection: 'row', gap: 8 },
	inputSmall: { borderWidth: 1, borderColor: '#e5e7eb', padding: 8, borderRadius: 8, flex: 1 },
	resultItem: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
	resultTitle: { fontWeight: '700' },
	resultText: { color: '#374151' },
});