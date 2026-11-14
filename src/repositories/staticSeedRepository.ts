import type { DemandRepository, QualifiedNeed, UUID } from '../domain/types';
import { seedDemands } from '../data/seed-demands';
import { SeedReadOnlyError } from './errors';

/**
 * Catálogo de demandas seed do bundle (AG-06). Somente leitura.
 * Nunca insere no Supabase.
 */
export function createStaticSeedRepository(
  seeds: readonly QualifiedNeed[] = seedDemands,
): DemandRepository {
  const byId = new Map(seeds.map((need) => [need.id, need]));

  return {
    async list(): Promise<QualifiedNeed[]> {
      return [...seeds].sort((a, b) => {
        const byDate = a.createdAt.localeCompare(b.createdAt);
        return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
      });
    },

    async get(id: UUID): Promise<QualifiedNeed | null> {
      return byId.get(id) ?? null;
    },

    save() {
      return Promise.reject(new SeedReadOnlyError());
    },
  };
}
