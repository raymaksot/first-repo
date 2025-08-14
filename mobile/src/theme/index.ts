import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export function resolveTheme(mode: ThemeMode, system: 'light' | 'dark'): 'light' | 'dark' {
  if (mode === 'system') return system;
  return mode;
}

export function useResolvedTheme(mode: ThemeMode): 'light' | 'dark' {
  const scheme = useColorScheme() ?? 'light';
  return resolveTheme(mode, scheme);
}