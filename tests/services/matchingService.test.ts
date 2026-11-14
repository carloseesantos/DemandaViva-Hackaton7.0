import { describe, expect, it } from 'vitest';
import { demoScenarioA, demoScenarioC } from '../../src/data/scenarios/demo-scenarios';
import { seedDemands } from '../../src/data/seed-demands';
import { solutions } from '../../src/data/solutions';
import { evaluateNeed, evaluateSolution } from '../../src/services/matchingService';
import { buildBrief } from '../../src/services/briefService';
import { explainClusters, suggestClusters } from '../../src/services/clusterService';
import {
  negativeScenarioD,
  negativeScenarioE,
  overBudgetEstoquePonte,
} from '../fixtures/ag06-negative-scenarios';

const NOW = '2026-11-14T12:00:00Z';

describe('matchingService AG-07 (API pública)', () => {
  it('cenário A: recommended 90 após seis gates', () => {
    const evaluation = evaluateNeed(demoScenarioA, NOW);
    expect(evaluation.status).toBe('recommended');
    if (evaluation.status === 'insufficient_data') throw new Error('unexpected');
    const top = evaluation.results.find((r) => r.solutionId === evaluation.topSolutionId);
    expect(top?.outcome).toBe('eligible');
    if (top?.outcome === 'eligible') {
      expect(top.score).toBe(90);
      expect(top.breakdown.map((c) => c.rating)).toEqual([5, 5, 4, 4, 4]);
      expect(top.gates.every((g) => g.status === 'pass')).toBe(true);
      expect(top.explanations.some((e) => /Score total calculado 90/i.test(e))).toBe(true);
    }
  });

  it('seed B: EstoquePonte inelegível sem score; evaluation no_eligible', () => {
    const need = seedDemands[0]!;
    const evaluation = evaluateNeed(need, NOW);
    expect(evaluation.status).toBe('no_eligible_catalog_solution');
    const estoque = evaluation.results.find((r) => r.solutionId === 'solution:estoqueponte-v1');
    expect(estoque?.outcome).toBe('ineligible');
    if (estoque?.outcome === 'ineligible') {
      expect(estoque).not.toHaveProperty('score');
      expect(estoque.failedGateCodes).toContain('technical_dependencies');
    }
  });

  it('C: insufficient_data sem resultados', () => {
    const evaluation = evaluateNeed(demoScenarioC, NOW);
    expect(evaluation.status).toBe('insufficient_data');
    expect(evaluation.results).toEqual([]);
  });

  it('ordem do catálogo não altera top/score', () => {
    const forward = evaluateNeed(demoScenarioA, NOW, [...solutions]);
    const reverse = evaluateNeed(demoScenarioA, NOW, [...solutions].reverse());
    expect(forward.status).toBe(reverse.status);
    if (forward.status === 'insufficient_data' || reverse.status === 'insufficient_data') return;
    expect(forward.topSolutionId).toBe(reverse.topSolutionId);
  });
});

describe('briefService AG-07', () => {
  it('B gera minuta; C não produz briefing definitivo via buildBrief', () => {
    const bEval = evaluateNeed(seedDemands[0]!, NOW);
    expect(bEval.status).toBe('no_eligible_catalog_solution');
    const brief = buildBrief(seedDemands[0]!, bEval, NOW);
    expect(brief.needId).toBe(seedDemands[0]!.id);
    expect(brief.review.status).toBe('draft');
    expect(brief.catalogGaps.some((g) => g.solutionId === 'solution:estoqueponte-v1')).toBe(true);

    const aEval = evaluateNeed(demoScenarioA, NOW);
    expect(() => buildBrief(demoScenarioA, aEval, NOW)).toThrow(/briefing/i);
  });
});

describe('clusterService AG-07', () => {
  it('seeds formam um cluster sugerido; D fica fora', () => {
    const clusters = suggestClusters([...seedDemands, negativeScenarioD]);
    const b = clusters.find((c) => c.signature === 'stock_confirmation_delay|manual|no_erp|whatsapp');
    expect(b?.needIds).toHaveLength(4);
    expect(b?.review.status).toBe('suggested');
    expect(clusters.every((c) => !c.needIds.includes(negativeScenarioD.id) || c !== b)).toBe(true);
    expect(b?.needIds.includes(negativeScenarioD.id)).toBe(false);

    const explained = explainClusters(seedDemands);
    expect(explained[0]?.whyGrouped.length).toBeGreaterThan(0);
    expect(explained[0]?.humanReviewHint).toMatch(/revisão humana/i);
  });
});

describe('evaluateSolution pontual', () => {
  it('variante over-budget só no teste', () => {
    const catalog = solutions.find((s) => s.id === 'solution:estoqueponte-v1')!;
    const pass = evaluateSolution(negativeScenarioE, catalog, NOW);
    expect(pass.gates.find((g) => g.code === 'hard_budget')?.status).toBe('pass');
    const fail = evaluateSolution(negativeScenarioE, overBudgetEstoquePonte, NOW);
    expect(fail.outcome).toBe('ineligible');
  });
});
