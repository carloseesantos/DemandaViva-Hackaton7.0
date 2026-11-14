import { describe, expect, it } from 'vitest';
import { createEmptyDraft } from '../../src/features/localState/draftStore';
import { prefillScenarioB, qualifyDraft } from '../../src/features/interview/qualifyNeed';

describe('qualifyNeed', () => {
  it('cenário B pré-preenchido qualifica sem inventar campos', () => {
    const draft = prefillScenarioB(createEmptyDraft().id);
    const result = qualifyDraft(draft);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.need.hasErp).toBe(false);
    expect(result.need.erpCode).toBeNull();
    expect(result.need.origin).toBe('remote');
    expect(result.need.problemSummary).toMatch(/confirmação manual de estoque/i);
  });

  it('rascunho vazio gera C com missingFields', () => {
    const result = qualifyDraft(createEmptyDraft());
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.draft.status).toBe('insufficient_data');
    expect(result.missingFields.length).toBeGreaterThan(0);
  });
});
