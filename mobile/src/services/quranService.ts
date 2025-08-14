import { apiGet } from './apiClient';
import { DefaultCacheTtls, fetchWithCache, makeCacheKey } from '../utils/cache';

export type SurahSummary = {
  number: number;
  name: string; // original name (Arabic)
  englishName: string;
  englishNameTranslation?: string;
  numberOfAyahs: number;
};

function normalizeSurah(raw: any): SurahSummary {
  return {
    number: raw.number ?? raw.index ?? raw.id ?? 0,
    name: raw.name ?? raw.arabicName ?? raw.title ?? '',
    englishName: raw.englishName ?? raw.nameEnglish ?? raw.name_translated ?? '',
    englishNameTranslation: raw.englishNameTranslation ?? raw.translation_en ?? raw.translation,
    numberOfAyahs: raw.numberOfAyahs ?? raw.ayahsCount ?? raw.verses ?? 0,
  };
}

export async function getSurahList(): Promise<SurahSummary[]> {
  const key = makeCacheKey('quran:surah-list');
  return fetchWithCache<SurahSummary[]>(
    key,
    async () => {
      const data = await apiGet<any>('/quran/surahs');
      const list = (data?.data ?? data?.surahs ?? data ?? []).map(normalizeSurah);
      return list;
    },
    {
      ttlMs: DefaultCacheTtls.SurahList,
      version: 'v1',
      keyPrefix: 'quran',
    }
  );
}

export async function invalidateSurahListCache(): Promise<void> {
  // consumer can call clearCached if needed; keeping an explicit function for clarity
}