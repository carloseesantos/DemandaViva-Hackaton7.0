import type { DemandRepository, NeedDraft, Need, QualifiedNeed, UUID } from '../../domain/types';
import { seedDemands } from '../../data/seed-demands';
import { demoScenarioA, demoScenarioC } from '../../data/scenarios/demo-scenarios';
import { readDraft } from '../localState/draftStore';
import { getSessionNeed } from '../localState/sessionNeedsStore';

export type ResolvedNeed =
  | { kind: 'qualified'; need: QualifiedNeed; source: 'seed' | 'scenario' | 'session' | 'remote' }
  | { kind: 'draft'; need: NeedDraft; source: 'draft' | 'scenario' }
  | { kind: 'missing' };

export async function resolveNeed(
  needId: string,
  repository: DemandRepository,
): Promise<ResolvedNeed> {
  const seed = seedDemands.find((n) => n.id === needId);
  if (seed) return { kind: 'qualified', need: seed, source: 'seed' };

  if (demoScenarioA.id === needId) {
    return { kind: 'qualified', need: demoScenarioA, source: 'scenario' };
  }
  if (demoScenarioC.id === needId) {
    return { kind: 'draft', need: demoScenarioC, source: 'scenario' };
  }

  const session = getSessionNeed(needId);
  if (session) return { kind: 'qualified', need: session.need, source: 'session' };

  const draft = readDraft();
  if (draft && draft.id === needId) return { kind: 'draft', need: draft, source: 'draft' };

  try {
    const remote = await repository.get(needId as UUID);
    if (remote) return { kind: 'qualified', need: remote, source: 'remote' };
  } catch {
    // repositório não configurado / offline — tratado pelo chamador
  }

  return { kind: 'missing' };
}

export function asEvaluable(resolved: ResolvedNeed): Need | null {
  if (resolved.kind === 'missing') return null;
  return resolved.need;
}
