import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setCached<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
	const record = { value, expiresAt: Date.now() + ttlSeconds * 1000 };
	await AsyncStorage.setItem(key, JSON.stringify(record));
}

export async function getCached<T>(key: string): Promise<T | null> {
	try {
		const raw = await AsyncStorage.getItem(key);
		if (!raw) return null;
		const record = JSON.parse(raw) as { value: T; expiresAt: number };
		if (Date.now() > record.expiresAt) {
			await AsyncStorage.removeItem(key);
			return null;
		}
		return record.value;
	} catch {
		return null;
	}
}