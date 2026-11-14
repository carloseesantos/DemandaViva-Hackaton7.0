import { useCallback, useState } from 'react';
import type { QualifiedNeed } from '../../domain/types';
import { useDependencies } from '../../app/dependencies';
import { seedDemands } from '../../data/seed-demands';
import { listSessionNeeds } from '../localState/sessionNeedsStore';

export type MergeSource = 'seed' | 'remote' | 'session_local';

export type MergedDemand = {
  need: QualifiedNeed;
  source: MergeSource;
};

export type MergeState = {
  loading: boolean;
  demands: MergedDemand[];
  remoteError: string | null;
  remotePartial: boolean;
  seedCount: number;
  remoteCount: number;
  sessionLocalCount: number;
  totalDistinct: number;
};

function classify(need: QualifiedNeed): MergeSource {
  if (need.origin === 'seed') return 'seed';
  if (need.origin === 'remote') return 'remote';
  return 'session_local';
}

function dedupe(items: MergedDemand[]): MergedDemand[] {
  const map = new Map<string, MergedDemand>();
  // Seed vence colisão (ARCHITECTURE §5 / AG-08).
  for (const item of items) {
    const existing = map.get(item.need.id);
    if (!existing) {
      map.set(item.need.id, item);
      continue;
    }
    if (existing.source === 'seed') continue;
    if (item.source === 'seed') map.set(item.need.id, item);
  }
  return [...map.values()].sort(
    (a, b) =>
      a.need.createdAt.localeCompare(b.need.createdAt) ||
      String(a.need.id).localeCompare(String(b.need.id)),
  );
}

const initialSeeds: MergedDemand[] = seedDemands.map((need) => ({ need, source: 'seed' as const }));

export function useMergedDemands() {
  const { demandRepository, remoteSharingEnabled } = useDependencies();
  const [state, setState] = useState<MergeState>({
    loading: false,
    demands: dedupe(initialSeeds),
    remoteError: remoteSharingEnabled
      ? null
      : 'A sincronização entre navegadores não está habilitada nesta versão.',
    remotePartial: true,
    seedCount: seedDemands.length,
    remoteCount: 0,
    sessionLocalCount: 0,
    totalDistinct: seedDemands.length,
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    let listed: QualifiedNeed[];
    let remoteError: string | null = null;
    let remotePartial = !remoteSharingEnabled;

    try {
      listed = await demandRepository.list();
    } catch {
      listed = [...seedDemands];
      remoteError =
        'Não foi possível atualizar as demandas registradas na nuvem. Mostrando apenas exemplos locais.';
      remotePartial = true;
    }

    if (!remoteSharingEnabled && !remoteError) {
      remoteError =
        'Não foi possível atualizar as demandas registradas na nuvem. Mostrando apenas exemplos locais.';
      remotePartial = true;
    }

    const fromRepo: MergedDemand[] = listed.map((need) => ({ need, source: classify(need) }));
    const listedIds = new Set(listed.map((n) => n.id));

    const sessionLocals: MergedDemand[] = listSessionNeeds()
      .filter((r) => r.need.origin === 'remote')
      .filter((r) => r.persistence.state !== 'synced')
      .filter((r) => !listedIds.has(r.need.id))
      .map((r) => ({ need: r.need, source: 'session_local' as const }));

    // Garante seeds do bundle mesmo se o repositório falhar parcialmente.
    const seedFallback: MergedDemand[] = seedDemands
      .filter((need) => !listedIds.has(need.id))
      .map((need) => ({ need, source: 'seed' as const }));

    const merged = dedupe([...fromRepo, ...seedFallback, ...sessionLocals]);
    const seedCount = merged.filter((d) => d.source === 'seed').length;
    const remoteCount = merged.filter((d) => d.source === 'remote').length;
    const sessionLocalCount = merged.filter((d) => d.source === 'session_local').length;

    setState({
      loading: false,
      demands: merged,
      remoteError,
      remotePartial,
      seedCount,
      remoteCount,
      sessionLocalCount,
      totalDistinct: merged.length,
    });
  }, [demandRepository, remoteSharingEnabled]);

  return { ...state, refresh };
}
