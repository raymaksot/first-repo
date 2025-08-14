import { apiGet, apiPost } from './api';

export interface ReadingGroup { _id: string; name: string; description?: string; createdBy: string; createdAt: string }
export interface Member { userId: string; role: 'owner' | 'member' }
export interface Progress { _id: string; userId: string; surah: number; fromAyah: number; toAyah: number; completed: boolean }
export interface Message { _id: string; userId: string; text: string; createdAt: string }

export const groupsService = {
  list(): Promise<ReadingGroup[]> { return apiGet('/api/reading-groups'); },
  create(input: { name: string; description?: string }): Promise<ReadingGroup> { return apiPost('/api/reading-groups', input); },
  get(id: string): Promise<{ group: ReadingGroup; members: Member[] }> { return apiGet(`/api/reading-groups/${id}`); },
  join(id: string): Promise<{ joined: boolean }> { return apiPost(`/api/reading-groups/${id}/join`); },
  leave(id: string): Promise<{ left: boolean }> { return apiPost(`/api/reading-groups/${id}/leave`); },
  progress(id: string): Promise<Progress[]> { return apiGet(`/api/reading-groups/${id}/progress`); },
  setProgress(id: string, input: { surah: number; fromAyah: number; toAyah: number; completed: boolean }): Promise<Progress> { return apiPost(`/api/reading-groups/${id}/progress`, input); },
  messages(id: string): Promise<Message[]> { return apiGet(`/api/reading-groups/${id}/messages`); },
  sendMessage(id: string, text: string): Promise<Message> { return apiPost(`/api/reading-groups/${id}/messages`, { text }); },
};