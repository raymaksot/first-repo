import { apiGet } from './apiClient';
import { DefaultCacheTtls, fetchWithCache, makeCacheKey } from '../utils/cache';

export type DuaItem = {
  id: string;
  category?: string;
  title: string;
  arabic: string;
  translation?: string;
  transliteration?: string;
  audioUrl?: string;
};

function normalizeDua(raw: any): DuaItem {
  return {
    id: String(raw.id ?? raw._id ?? raw.slug ?? raw.key ?? Math.random()),
    category: raw.category ?? raw.group,
    title: raw.title ?? raw.name ?? '',
    arabic: raw.arabic ?? raw.text_ar ?? raw.text ?? '',
    translation: raw.translation ?? raw.text_en ?? raw.meaning_en,
    transliteration: raw.transliteration ?? raw.text_translit,
    audioUrl: raw.audioUrl ?? raw.audio ?? raw.audio_url,
  };
}

export async function getDuaList(): Promise<DuaItem[]> {
  const key = makeCacheKey('dua:list');
  return fetchWithCache<DuaItem[]>(
    key,
    async () => {
      const data = await apiGet<any>('/duas');
      const list = (data?.data ?? data?.duas ?? data ?? []).map(normalizeDua);
      return list;
    },
    { ttlMs: DefaultCacheTtls.DuaList, version: 'v1', keyPrefix: 'dua' }
  );
}