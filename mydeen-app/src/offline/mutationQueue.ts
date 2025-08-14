import { appStorage } from '@/utils/cache';
import { commentsService } from '@/services/commentsService';
import { groupsService } from '@/services/groupsService';

export type MutationRecord = {
	id: string;
	type: 'createComment' | 'setGroupProgress';
	payload: any;
	createdAt: number;
};

const KEY = 'offline:mutations';

async function getAll(): Promise<MutationRecord[]> {
	return (await appStorage.getObject<MutationRecord[]>(KEY)) || [];
}

async function saveAll(items: MutationRecord[]): Promise<void> {
	await appStorage.setObject(KEY, items);
}

export async function enqueue(type: MutationRecord['type'], payload: any): Promise<MutationRecord> {
	const rec: MutationRecord = { id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, type, payload, createdAt: Date.now() };
	const arr = await getAll();
	arr.push(rec);
	await saveAll(arr);
	return rec;
}

export async function flushOnce(): Promise<boolean> {
	const arr = await getAll();
	if (!arr.length) return true;
	const next = arr[0];
	try {
		switch (next.type) {
			case 'createComment':
				await commentsService.create(next.payload);
				break;
			case 'setGroupProgress':
				await groupsService.setProgress(next.payload.groupId, next.payload);
				break;
			default:
				break;
		}
		const rest = arr.slice(1);
		await saveAll(rest);
		return true;
	} catch {
		return false;
	}
}

export async function flushAll(maxTries = 100): Promise<void> {
	for (let i = 0; i < maxTries; i++) {
		const ok = await flushOnce();
		if (!ok) break;
		const remaining = await getAll();
		if (!remaining.length) break;
	}
}

export async function size(): Promise<number> {
	const arr = await getAll();
	return arr.length;
}