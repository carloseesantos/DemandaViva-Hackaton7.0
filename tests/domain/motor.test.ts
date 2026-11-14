/**
 * AG-07 — testes canônicos do motor determinístico (não usam referenceMatcher).
 */
import { describe, expect, it } from 'vitest';
import {
  calculateCompatibilityScore,
  detectSimilarNeeds,
  evaluateCatalogMatch,
  evaluateEligibility,
  evaluateSolutionMatch,
  generateBriefing,
  qualifyNeed,
  rankSolutions,
  validateNeed,
  type SolutionOperationalFacts,
} from '../../src/domain';
import { BUDGET_CAP_CENTS } from '../../src/data/catalog-enums';
import { MATCH_BUDGET_CAP_CENTS } from '../../src/domain/matchRules';
import { catalogEvidence, solutions, solutionDisplayDetails } from '../../src/data/solutions';
import { demoScenarioA, demoScenarioC } from '../../src/data/scenarios/demo-scenarios';
import { seedDemands } from '../../src/data/seed-demands';
import { negativeScenarioD, negativeScenarioE, overBudgetEstoquePonte } from '../fixtures/ag06-negative-scenarios';
import { scenarioE } from '../scenarios';
import type { ISODateTime, UUID } from '../../src/domain/types';

const NOW = '2026-11-14T21:20:00Z';

function factsFor(solutionId: string): SolutionOperationalFacts {
  const d = solutionDisplayDetails[solutionId];
  if (!d) throw new Error(`facts ausentes: ${solutionId}`);
  return {
    trainingHours: d.support.trainingHours,
    mobileSupported: d.mobileSupported,
    offlineSupported: d.offlineSupported,
  };
}

function estoque() {
  const s = solutions.find((x) => x.id === 'solution:estoqueponte-v1');
  if (!s) throw new Error('EstoquePonte ausente');
  return s;
}

describe('AG-07 | alinhamento de tetos e cenário A = 90 calculado', () => {
  it('tetos match-v1 coincidem com catálogo AG-05', () => {
    expect(MATCH_BUDGET_CAP_CENTS).toEqual(BUDGET_CAP_CENTS);
  });

  it('CT-A: EstoquePonte elegível com notas 5,5,4,4,4 e score 90', () => {
    const solution = estoque();
    const eligibility = evaluateEligibility(
      demoScenarioA,
      solution,
      NOW,
      catalogEvidence,
      factsFor(solution.id),
    );
    expect(eligibility.outcome).toBe('eligible');
    if (eligibility.outcome !== 'eligible') return;

    const scored = calculateCompatibilityScore(
      demoScenarioA,
      solution,
      eligibility.validEvidenceIds.length,
    );
    expect(scored.breakdown.map((c) => c.rating)).toEqual([5, 5, 4, 4, 4]);
    expect(scored.score).toBe(90);
    expect(scored.recommendation).toBe('recommended');
    expect(scored.score).toBe(
      Number(
        (
          scored.breakdown.reduce((acc, c) => acc + (c.weight * c.rating) / 5, 0)
        ).toFixed(1),
      ),
    );

    const evaluation = evaluateCatalogMatch(
      demoScenarioA,
      NOW,
      solutions,
      catalogEvidence,
      (s) => factsFor(s.id),
    );
    expect(evaluation.status).toBe('recommended');
    if (evaluation.status === 'insufficient_data') return;
    expect(evaluation.topSolutionId).toBe('solution:estoqueponte-v1');
  });
});

describe('AG-07 | B sem ERP — sem score para EstoquePonte', () => {
  it('reprova technical_dependencies e não materializa score', () => {
    for (const need of seedDemands) {
      const result = evaluateSolutionMatch(
        need,
        estoque(),
        NOW,
        catalogEvidence,
        factsFor('solution:estoqueponte-v1'),
      );
      expect(result.outcome).toBe('ineligible');
      if (result.outcome !== 'ineligible') return;
      expect(result.failedGateCodes).toContain('technical_dependencies');
      expect(result).not.toHaveProperty('score');
      expect(result).not.toHaveProperty('breakdown');
      expect(JSON.stringify(result)).not.toContain('"score"');
    }
  });
});

describe('AG-07 | curadoria expirada e custo desconhecido', () => {
  it('solução expirada não gera match confirmado', () => {
    const expired = solutions.find((s) => s.id === 'solution:visordelegado-v1');
    expect(expired).toBeTruthy();
    const result = evaluateSolutionMatch(
      demoScenarioA,
      expired!,
      NOW,
      catalogEvidence,
      factsFor(expired!.id),
    );
    expect(result.outcome).toBe('ineligible');
    expect(result.gates.some((g) => g.code === 'curation_evidence' && g.status === 'fail')).toBe(
      true,
    );
    expect(result).not.toHaveProperty('score');
  });

  it('custo desconhecido pede esclarecimento no gate hard_budget', () => {
    const unknown = solutions.find((s) => s.id === 'solution:fechorapido-v1');
    expect(unknown).toBeTruthy();
    // scenarioE (sales_reconciliation) é o par funcional de FechoRápido; E-orçamento é outro fixture.
    const result = evaluateSolutionMatch(
      scenarioE,
      unknown!,
      NOW,
      catalogEvidence,
      factsFor(unknown!.id),
    );
    expect(result.outcome).toBe('needs_information');
    if (result.outcome !== 'needs_information') return;
    expect(result.gates.some((g) => g.code === 'hard_budget' && g.status === 'unknown')).toBe(true);
    expect(result.missingInformation.some((m) => /hard_budget|Preço|implantação/i.test(m))).toBe(
      true,
    );
    expect(result).not.toHaveProperty('score');
  });

  it('E: variante R$ 299 falha hard_budget; catálogo real R$ 199 passa', () => {
    const real = evaluateSolutionMatch(
      negativeScenarioE,
      estoque(),
      NOW,
      catalogEvidence,
      factsFor('solution:estoqueponte-v1'),
    );
    expect(real.gates.find((g) => g.code === 'hard_budget')?.status).toBe('pass');

    const variant = evaluateSolutionMatch(
      negativeScenarioE,
      overBudgetEstoquePonte,
      NOW,
      catalogEvidence,
      factsFor('solution:estoqueponte-v1'),
    );
    expect(variant.outcome).toBe('ineligible');
    expect(variant.gates.find((g) => g.code === 'hard_budget')?.status).toBe('fail');
    expect(variant).not.toHaveProperty('score');
  });
});

describe('AG-07 | C incompleto — insufficient_data sem briefing definitivo', () => {
  it('validateNeed/qualifyNeed e generateBriefing recusam conclusão', () => {
    const v = validateNeed(demoScenarioC);
    expect(v.ok).toBe(false);
    if (v.ok) return;
    expect(v.missingFields.length).toBeGreaterThan(0);

    const q = qualifyNeed({
      draft: demoScenarioC,
      id: demoScenarioC.id,
      createdAt: NOW as ISODateTime,
      origin: 'scenario_fixture',
      problemSummary: 'A confirmação manual de estoque atrasa respostas a pedidos.',
    });
    expect(q.status).toBe('insufficient_data');

    const evaluation = evaluateCatalogMatch(
      demoScenarioC,
      NOW,
      solutions,
      catalogEvidence,
      (s) => factsFor(s.id),
    );
    expect(evaluation.status).toBe('insufficient_data');
    expect(evaluation.results).toEqual([]);

    const briefing = generateBriefing(demoScenarioC, evaluation, NOW as ISODateTime);
    expect(briefing.kind).toBe('insufficient_data');
    if (briefing.kind !== 'insufficient_data') return;
    expect(briefing.reason).toMatch(/incompleto|insuficiente|complementar/i);
  });
});

describe('AG-07 | cluster: compatíveis vs homônimos', () => {
  it('inclui as quatro seeds B e exclui D (mesmo texto, contexto incompatível)', () => {
    const mixed = [...seedDemands, negativeScenarioD, demoScenarioA];
    const explained = detectSimilarNeeds(mixed);

    const seedIds = new Set(seedDemands.map((n) => String(n.id)));
    const clusterB = explained.find((e) =>
      e.cluster.needIds.some((id) => seedIds.has(String(id))),
    );
    expect(clusterB).toBeTruthy();
    expect(clusterB!.cluster.needIds).toHaveLength(4);
    expect(clusterB!.cluster.needIds.every((id) => seedIds.has(String(id)))).toBe(true);
    expect(clusterB!.cluster.signature).toBe('stock_confirmation_delay|manual|no_erp|whatsapp');
    expect(clusterB!.cluster.review.status).toBe('suggested');
    expect(clusterB!.humanReviewHint).toMatch(/revisão humana/i);
    expect(clusterB!.preservedDifferences.length).toBeGreaterThan(0);

    const hasD = explained.some((e) =>
      e.cluster.needIds.some((id) => String(id) === String(negativeScenarioD.id)),
    );
    expect(hasD).toBe(true);
    const clusterD = explained.find((e) =>
      e.cluster.needIds.some((id) => String(id) === String(negativeScenarioD.id)),
    )!;
    expect(clusterD.cluster.signature).not.toBe(clusterB!.cluster.signature);
    expect(clusterD.cluster.needIds).not.toEqual(expect.arrayContaining([...seedIds] as UUID[]));

    // Homônimo textual não basta: D permanece fora do bucket B.
    expect(negativeScenarioD.problemSummary).toBe(seedDemands[0]!.problemSummary);
    expect(clusterB!.cluster.needIds.map(String)).not.toContain(String(negativeScenarioD.id));
  });
});

describe('AG-07 | determinismo e independência de ordem', () => {
  it('mesma entrada × catálogo embaralhado → mesmos outcomes/scores', () => {
    const shuffled = [...solutions].sort((a, b) => b.id.localeCompare(a.id));
    const a1 = evaluateCatalogMatch(demoScenarioA, NOW, solutions, catalogEvidence, (s) =>
      factsFor(s.id),
    );
    const a2 = evaluateCatalogMatch(demoScenarioA, NOW, shuffled, catalogEvidence, (s) =>
      factsFor(s.id),
    );
    expect(a1.status).toBe(a2.status);
    if (a1.status === 'insufficient_data' || a2.status === 'insufficient_data') return;
    expect(a1.topSolutionId).toBe(a2.topSolutionId);
    const scoreOf = (ev: typeof a1, id: string) => {
      const r = ev.results.find((x) => x.solutionId === id);
      return r?.outcome === 'eligible' ? r.score : r?.outcome;
    };
    for (const s of solutions) {
      expect(scoreOf(a1, s.id)).toEqual(scoreOf(a2, s.id));
    }

    const needsFwd = [...seedDemands];
    const needsRev = [...seedDemands].reverse();
    const c1 = detectSimilarNeeds(needsFwd);
    const c2 = detectSimilarNeeds(needsRev);
    expect(c1.map((x) => x.cluster.id)).toEqual(c2.map((x) => x.cluster.id));
    expect(c1.map((x) => x.cluster.needIds)).toEqual(c2.map((x) => x.cluster.needIds));
  });

  it('rankSolutions ordena por score e id de forma estável', () => {
    const evaluation = evaluateCatalogMatch(
      demoScenarioA,
      NOW,
      solutions,
      catalogEvidence,
      (s) => factsFor(s.id),
    );
    const ranked = rankSolutions(evaluation.results);
    for (let i = 1; i < ranked.length; i++) {
      const prev = ranked[i - 1]!;
      const cur = ranked[i]!;
      expect(prev.score > cur.score || (prev.score === cur.score && prev.solutionId <= cur.solutionId)).toBe(
        true,
      );
    }
  });
});
