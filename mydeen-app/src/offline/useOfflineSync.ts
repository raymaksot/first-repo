import { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { flushAll, size } from './mutationQueue';

export function useOfflineSync() {
	const [syncing, setSyncing] = useState(false);
	const [pending, setPending] = useState(0);
	const isFocused = useIsFocused?.() ?? true;

	async function runFlush() {
		setSyncing(true);
		await flushAll();
		setPending(await size());
		setSyncing(false);
	}

	useEffect(() => {
		if (isFocused) {
			void runFlush();
		}
		const id = setInterval(() => void runFlush(), 30000);
		return () => clearInterval(id);
	}, [isFocused]);

	useEffect(() => {
		(async () => setPending(await size()))();
	}, []);

	return { syncing, pending, runFlush };
}