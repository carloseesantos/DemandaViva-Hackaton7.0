import type { DemandRepository, NewQualifiedNeed, PersistenceState, QualifiedNeed } from '../../domain/types';
import { upsertSessionNeed } from '../localState/sessionNeedsStore';

export async function persistQualifiedNeed(
  repository: DemandRepository,
  remoteSharingEnabled: boolean,
  need: QualifiedNeed,
): Promise<PersistenceState> {
  // Seeds e fixtures de cenário não vão ao Supabase.
  if (need.origin === 'seed' || need.origin === 'scenario_fixture') {
    const state: PersistenceState = { state: 'local_draft' };
    upsertSessionNeed({ need, persistence: state });
    return state;
  }

  if (!remoteSharingEnabled) {
    const state: PersistenceState = {
      state: 'sync_failed',
      id: need.id,
      reason: 'Sincronização remota não habilitada (G1S/AG-08 pendente).',
      retryAllowed: true,
    };
    upsertSessionNeed({ need, persistence: state });
    return state;
  }

  const saving: PersistenceState = { state: 'saving' };
  upsertSessionNeed({ need, persistence: saving });

  try {
    const payload: NewQualifiedNeed = {
      id: need.id,
      schemaVersion: need.schemaVersion,
      origin: 'remote',
      status: 'qualified',
      isDemo: true,
      associationCode: need.associationCode,
      segmentCode: need.segmentCode,
      sizeCode: need.sizeCode,
      channelCode: need.channelCode,
      painCode: need.painCode,
      processCode: need.processCode,
      frequencyCode: need.frequencyCode,
      hasErp: need.hasErp,
      erpCode: need.erpCode,
      problemSummary: need.problemSummary,
      requirements: need.requirements,
      constraints: need.constraints,
      metric: need.metric,
    };
    const saved = await repository.save(payload);
    const synced: PersistenceState = {
      state: 'synced',
      id: saved.id,
      savedAt: saved.createdAt,
    };
    upsertSessionNeed({ need: saved, persistence: synced });
    return synced;
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Falha desconhecida ao sincronizar';
    const failed: PersistenceState = {
      state: 'sync_failed',
      id: need.id,
      reason,
      retryAllowed: true,
    };
    upsertSessionNeed({ need, persistence: failed });
    return failed;
  }
}
