/**
 * Fachada AG-08 — porta `DemandRepository` (contrato em src/domain/types.ts).
 * UI consome via useDependencies(); não importa este módulo nem supabase-js.
 */
export type { DemandRepository, PersistenceState } from '../domain/types';

export { createStaticSeedRepository } from './staticSeedRepository';
export { createUnavailableDemandRepository } from './unavailableDemandRepository';
export { createSupabaseDemandRepository } from './supabaseDemandRepository';
export { createCompositeDemandRepository } from './compositeDemandRepository';
export { serializeForInsert, deserializeRow } from './mappers';
export type { DemoDemandInsertPayload, DemoDemandRow } from './mappers';
export { assertNewQualifiedNeed, collectNewQualifiedNeedIssues } from './validation';
export {
  DemandMappingError,
  DemandValidationError,
  RemoteUnavailableError,
  SeedReadOnlyError,
  SeedRemoteIdCollisionError,
} from './errors';

import type { DemandRepository } from '../domain/types';
import { createCompositeDemandRepository } from './compositeDemandRepository';
import { createStaticSeedRepository } from './staticSeedRepository';
import { createSupabaseDemandRepository } from './supabaseDemandRepository';
import type { PublishableSupabaseConfig } from './supabaseClient';
import { createUnavailableDemandRepository } from './unavailableDemandRepository';

export interface CreateDemandRepositoryResult {
  repository: DemandRepository;
  /**
   * true somente com adaptador remoto real E projeção cross-browser liberada (G1S).
   * Own-select + Auth Anonymous NÃO autoriza remoteSharingEnabled.
   */
  remoteSharingEnabled: boolean;
  /** true quando VITE_SUPABASE_* válidos foram usados para montar o cliente. */
  remoteConfigured: boolean;
}

/**
 * Composition helper para createDependencies.
 * Sem config → seeds + remote unavailable (SPA local).
 * Com config → seeds + Supabase (escrita/leitura própria); sharing cross-browser permanece false até G1S.
 */
export function createAppDemandRepository(
  supabase: PublishableSupabaseConfig | null,
): CreateDemandRepositoryResult {
  const seeds = createStaticSeedRepository();

  if (!supabase) {
    return {
      repository: createCompositeDemandRepository(seeds, createUnavailableDemandRepository()),
      remoteSharingEnabled: false,
      remoteConfigured: false,
    };
  }

  return {
    repository: createCompositeDemandRepository(seeds, createSupabaseDemandRepository(supabase)),
    // G1S pendente: RLS select_own não compartilha entre navegadores; não alegar sharing.
    remoteSharingEnabled: false,
    remoteConfigured: true,
  };
}
