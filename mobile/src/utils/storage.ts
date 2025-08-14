import AsyncStorage from '@react-native-async-storage/async-storage';

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const DEFAULT_PREFIX = 'app:';

function withPrefix(key: string, prefix: string = DEFAULT_PREFIX): string {
  return `${prefix}${key}`;
}

export async function setString(key: string, value: string, prefix?: string): Promise<void> {
  await AsyncStorage.setItem(withPrefix(key, prefix), value);
}

export async function getString(key: string, prefix?: string): Promise<string | null> {
  return AsyncStorage.getItem(withPrefix(key, prefix));
}

export async function remove(key: string, prefix?: string): Promise<void> {
  await AsyncStorage.removeItem(withPrefix(key, prefix));
}

export async function setObject<T extends JsonValue>(key: string, value: T, prefix?: string): Promise<void> {
  const serialized = JSON.stringify(value);
  await AsyncStorage.setItem(withPrefix(key, prefix), serialized);
}

export async function getObject<T extends JsonValue>(key: string, prefix?: string): Promise<T | null> {
  const val = await AsyncStorage.getItem(withPrefix(key, prefix));
  if (val == null) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

export async function multiGet(keys: string[], prefix?: string): Promise<[string, string | null][]> {
  const realKeys = keys.map((k) => withPrefix(k, prefix));
  return AsyncStorage.multiGet(realKeys);
}

export async function multiSet(entries: [string, string][], prefix?: string): Promise<void> {
  const realEntries = entries.map(([k, v]) => [withPrefix(k, prefix), v]);
  await AsyncStorage.multiSet(realEntries);
}

export async function multiRemove(keys: string[], prefix?: string): Promise<void> {
  const realKeys = keys.map((k) => withPrefix(k, prefix));
  await AsyncStorage.multiRemove(realKeys);
}

export async function getAllKeys(prefix?: string): Promise<string[]> {
  const all = await AsyncStorage.getAllKeys();
  const p = prefix ?? DEFAULT_PREFIX;
  return all.filter((k) => k.startsWith(p));
}

export function createStorage(prefix: string) {
  return {
    setString: (key: string, value: string) => setString(key, value, prefix),
    getString: (key: string) => getString(key, prefix),
    remove: (key: string) => remove(key, prefix),
    setObject: <T extends JsonValue>(key: string, value: T) => setObject<T>(key, value, prefix),
    getObject: <T extends JsonValue>(key: string) => getObject<T>(key, prefix),
    multiGet: (keys: string[]) => multiGet(keys.map((k) => k), prefix),
    multiSet: (entries: [string, string][]) => multiSet(entries, prefix),
    multiRemove: (keys: string[]) => multiRemove(keys, prefix),
    getAllKeys: () => getAllKeys(prefix),
  };
}

export const appStorage = createStorage('app:');