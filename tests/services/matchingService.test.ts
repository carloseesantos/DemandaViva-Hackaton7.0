import { describe, expect, it } from 'vitest';
import { demoScenarioA } from '../../src/data/scenarios/demo-scenarios';
import { seedDemands } from '../../src/data/seed-demands';
import { evaluateNeed } from '../../src/services/matchingService';

describe('matchingService temporário (AG-09 → AG-07)', () => {
  it('cenário A: recommended 90 após seis gates', () => {
    const evaluation = evaluateNeed(demoScenarioA, '2026-11-14T12:00:00Z');
    expect(evaluation.status).toBe('recommended');
    if (evaluation.status === 'insufficient_data') throw new Error('unexpected');
    const top = evaluation.results.find((r) => r.solutionId === evaluation.topSolutionId);
    expect(top?.outcome).toBe('eligible');
    if (top?.outcome === 'eligible') {
      expect(top.score).toBe(90);
      expect(top.gates.every((g) => g.status === 'pass')).toBe(true);
    }
  });

  it('seed B: inelegível sem score', () => {
    const need = seedDemands[0]!;
    const evaluation = evaluateNeed(need, '2026-11-14T12:00:00Z');
    expect(evaluation.status).toBe('no_eligible_catalog_solution');
    const estoque = evaluation.results.find((r) => r.solutionId === 'solution:estoqueponte-v1');
    expect(estoque?.outcome).toBe('ineligible');
    if (estoque?.outcome === 'ineligible') {
      expect(estoque).not.toHaveProperty('score');
      expect(estoque.failedGateCodes).toContain('technical_dependencies');
    }
  });
});
