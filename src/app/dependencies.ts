import { createContext, useContext } from 'react';
import type { DemandRepository } from '../domain/types';
import type { RuntimeConfig } from './env';

/**
 * Portas injetadas na UI. Páginas e features consomem apenas estas interfaces;
 * adaptadores concretos (seeds, Supabase, composite) são montados em createDependencies.
 */
export interface AppDependencies {
  demandRepository: DemandRepository;
  runtime: RuntimeConfig;
  /** `true` somente quando um adaptador remoto real estiver montado e configurado. */
  remoteSharingEnabled: boolean;
}

export const DependenciesContext = createContext<AppDependencies | null>(null);

export function useDependencies(): AppDependencies {
  const deps = useContext(DependenciesContext);
  if (!deps) throw new Error('useDependencies() fora de <DependenciesProvider>.');
  return deps;
}
