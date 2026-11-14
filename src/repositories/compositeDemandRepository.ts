import type { DemandRepository, NewQualifiedNeed, QualifiedNeed, UUID } from '../domain/types';
import { SeedRemoteIdCollisionError } from './errors';

export interface CompositeDemandRepositoryOptions {
  /** Chamado quando um UUID remoto colide com seed (seed vence). */
  onSeedCollision?: (error: SeedRemoteIdCollisionError) => void;
  /**
   * Se true (padrão), falha de list/get remoto devolve só seeds (SPA offline).
   * save() nunca engole erro — confirmação remota é obrigatória.
   */
  degradeListOnRemoteError?: boolean;
}

function sortNeeds(needs: QualifiedNeed[]): QualifiedNeed[] {
  return [...needs].sort((a, b) => {
    const byDate = a.createdAt.localeCompare(b.createdAt);
    return byDate !== 0 ? byDate : a.id.localeCompare(b.id);
  });
}

/**
 * Mescla seeds estáticos com registros remotos (DATA_MODEL §9).
 * save() delega ao remoto e só resolve após confirmação do servidor.
 * Dedupe por UUID: seed tem prioridade; não deduplicar por texto.
 */
export function createCompositeDemandRepository(
  seeds: DemandRepository,
  remote: DemandRepository,
  options: CompositeDemandRepositoryOptions = {},
): DemandRepository {
  const degrade = options.degradeListOnRemoteError !== false;

  async function mergeList(): Promise<QualifiedNeed[]> {
    const local = await seeds.list();
    let remoteRows: QualifiedNeed[];
    try {
      remoteRows = await remote.list();
    } catch (error) {
      if (!degrade) throw error;
      remoteRows = [];
    }

    const map = new Map<string, QualifiedNeed>();
    for (const need of local) map.set(need.id, need);
    for (const need of remoteRows) {
      if (map.has(need.id)) {
        const collision = new SeedRemoteIdCollisionError(need.id);
        options.onSeedCollision?.(collision);
        continue;
      }
      map.set(need.id, need);
    }
    return sortNeeds([...map.values()]);
  }

  return {
    save(need: NewQualifiedNeed): Promise<QualifiedNeed> {
      return remote.save(need);
    },

    list(): Promise<QualifiedNeed[]> {
      return mergeList();
    },

    async get(id: UUID): Promise<QualifiedNeed | null> {
      const local = await seeds.get(id);
      if (local) return local;
      try {
        return await remote.get(id);
      } catch (error) {
        if (!degrade) throw error;
        return null;
      }
    },
  };
}
