import { appStorage } from './storage';

export type CacheEntry<T> = {
  value: T;
  createdAt: number;
  expiresAt: number;
  version?: string;
};

export type CacheOptions = {
  ttlMs: number;
  version?: string;
  allowStaleOnError?: boolean;
  keyPrefix?: string;
};

function now(): number {
  return Date.now();
}

function buildKey(key: string, prefix?: string): string {
  const p = prefix ? `${prefix}:` : 'cache:';
  return `${p}${key}`;
}

export async function getCached<T>(key: string, options?: { keyPrefix?: string }): Promise<T | null> {
  const entry = await appStorage.getObject<CacheEntry<T>>(buildKey(key, options?.keyPrefix));
  if (!entry) return null;
  if (entry.expiresAt > now()) return entry.value;
  return null;
}

export async function getCachedEntry<T>(key: string, options?: { keyPrefix?: string }): Promise<CacheEntry<T> | null> {
  return appStorage.getObject<CacheEntry<T>>(buildKey(key, options?.keyPrefix));
}

export async function setCached<T>(key: string, value: T, { ttlMs, version, keyPrefix }: CacheOptions): Promise<void> {
  const entry: CacheEntry<T> = {
    value,
    createdAt: now(),
    expiresAt: now() + ttlMs,
    version,
  };
  await appStorage.setObject(buildKey(key, keyPrefix), entry);
}

export async function clearCached(key: string, options?: { keyPrefix?: string }): Promise<void> {
  await appStorage.remove(buildKey(key, options?.keyPrefix));
}

export function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((v) => stableStringify(v)).join(',')}]`;
  const obj = value as Record<string, unknown>;
  return `{${Object.keys(obj)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(',')}}`;
}

export function makeCacheKey(prefix: string, params?: Record<string, unknown>): string {
  if (!params) return prefix;
  return `${prefix}:${stableStringify(params)}`;
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions
): Promise<T> {
  const { ttlMs, version, allowStaleOnError = true, keyPrefix } = options;

  const existing = await getCachedEntry<T>(key, { keyPrefix });

  if (existing && existing.version === version && existing.expiresAt > now()) {
    return existing.value;
  }

  try {
    const fresh = await fetcher();
    await setCached<T>(key, fresh, { ttlMs, version, keyPrefix });
    return fresh;
  } catch (error) {
    if (existing && allowStaleOnError) {
      return existing.value;
    }
    throw error;
  }
}

export const DefaultCacheTtls = {
  SurahList: 7 * 24 * 60 * 60 * 1000, // 7 days
  DuaList: 24 * 60 * 60 * 1000, // 1 day
  HadithCollections: 7 * 24 * 60 * 60 * 1000, // 7 days
};