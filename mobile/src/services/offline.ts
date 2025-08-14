import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { fetchQuranAll, fetchDuasAll, fetchHadithAll } from './api';

const DB_NAME = 'offline.db';

export async function openDb() {
	const db = await SQLite.openDatabaseAsync(DB_NAME);
	await db.execAsync(`CREATE TABLE IF NOT EXISTS datasets (\n  id TEXT PRIMARY KEY,\n  data TEXT NOT NULL,\n  updatedAt INTEGER NOT NULL\n);`);
	return db;
}

export async function saveDataset(id: 'quran' | 'duas' | 'hadith', data: any) {
	const db = await openDb();
	await db.runAsync('INSERT OR REPLACE INTO datasets (id, data, updatedAt) VALUES (?, ?, ?)', [id, JSON.stringify(data), Date.now()]);
}

export async function getDataset<T = any>(id: 'quran' | 'duas' | 'hadith'): Promise<T | null> {
	const db = await openDb();
	const row = await db.getFirstAsync<{ data: string }>('SELECT data FROM datasets WHERE id = ?', [id]);
	if (row?.data) {
		return JSON.parse(row.data) as T;
	}
	return null;
}

export async function downloadAllDatasets() {
	const [quran, duas, hadith] = await Promise.all([fetchQuranAll(), fetchDuasAll(), fetchHadithAll()]);
	await saveDataset('quran', quran);
	await saveDataset('duas', duas);
	await saveDataset('hadith', hadith);
}

export function observeNetwork(callback: (offline: boolean) => void) {
	return NetInfo.addEventListener((state) => {
		callback(!Boolean(state.isConnected));
	});
}