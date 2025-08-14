import { apiGet } from './apiClient';
import { DefaultCacheTtls, fetchWithCache, makeCacheKey } from '../utils/cache';

export type HadithCollection = {
  id: string;
  name: string;
  arabicName?: string;
  author?: string;
  size?: number;
};

function normalizeCollection(raw: any): HadithCollection {
  return {
    id: String(raw.id ?? raw.slug ?? raw.key ?? raw._id ?? ''),
    name: raw.name ?? raw.englishName ?? '',
    arabicName: raw.arabicName ?? raw.name_ar,
    author: raw.author ?? raw.compiler,
    size: raw.size ?? raw.hadithCount ?? raw.count,
  };
}

export async function getHadithCollections(): Promise<HadithCollection[]> {
  const key = makeCacheKey('hadith:collections');
  return fetchWithCache<HadithCollection[]>(
    key,
    async () => {
      const data = await apiGet<any>('/hadith/collections');
      const list = (data?.data ?? data?.collections ?? data ?? []).map(normalizeCollection);
      return list;
    },
    { ttlMs: DefaultCacheTtls.HadithCollections, version: 'v1', keyPrefix: 'hadith' }
  );
}