import type { DemandRepository, QualifiedNeed } from '../domain/types';
import { RemoteUnavailableError } from './errors';

/**
 * Adaptador remoto quando não há VITE_SUPABASE_* ou a escrita pública está bloqueada (G1S).
 * list/get degradam para vazio; save falha de forma explícita (UI → sync_failed).
 */
export function createUnavailableDemandRepository(
  reason = 'Supabase não configurado ou compartilhamento remoto bloqueado até G1S',
): DemandRepository {
  return {
    async list(): Promise<QualifiedNeed[]> {
      return [];
    },

    async get(): Promise<QualifiedNeed | null> {
      return null;
    },

    save(): Promise<QualifiedNeed> {
      return Promise.reject(new RemoteUnavailableError(reason));
    },
  };
}
