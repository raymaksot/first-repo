import { useSelector } from 'react-redux';
import { RootState } from '../../store';

export function useCanAnswer(): boolean {
  const role = useSelector((s: RootState) => (s as any)?.auth?.user?.role ?? 'user');
  return role === 'scholar';
}