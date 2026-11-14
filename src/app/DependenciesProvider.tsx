import type { ReactNode } from 'react';
import { DependenciesContext, type AppDependencies } from './dependencies';

export function DependenciesProvider({ value, children }: { value: AppDependencies; children: ReactNode }) {
  return <DependenciesContext value={value}>{children}</DependenciesContext>;
}
