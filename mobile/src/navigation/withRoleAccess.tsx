import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export function withScholarAccess<P>(Component: React.ComponentType<P>) {
  return function WithAccess(props: P) {
    const role = useSelector((s: RootState) => (s as any)?.auth?.user?.role ?? 'user');
    if (role !== 'scholar') return null;
    return <Component {...props} />;
  };
}