/**
 * Orquestração: elegibilidade → score → ranking determinístico.
 */
import { MATCH_RULES_VERSION } from './types';
import type {
  CatalogEvidence,
  MatchEvaluation,
  MatchResult,
  Need,
  QualifiedNeed,
  Solution,
} from './types';
import { evaluateEligibility, type SolutionOperationalFacts } from './eligibility';
import { calculateCompatibilityScore } from './score';

export type OperationalFactsLookup = (solution: Solution) => SolutionOperationalFacts;

function baseExplanations(extra: string[] = []): { explanations: string[]; limitations: string[] } {
  return {
    explanations: [
      'Resultado gerado por gates antes do score; aprovação AC apenas simulada',
      ...extra,
    ],
    limitations: [
      'Startup, preço e todas as evidências são SIMULADOS; não são validações comerciais',
    ],
  };
}

/**
 * Avalia um par necessidade×solução. Inelegível / needs_information nunca recebem score.
 */
export function evaluateSolutionMatch(
  need: QualifiedNeed,
  solution: Solution,
  evaluatedAt: string,
  evidence: readonly CatalogEvidence[],
  facts: SolutionOperationalFacts,
): MatchResult {
  const eligibility = evaluateEligibility(need, solution, evaluatedAt, evidence, facts);
  const meta = {
    needId: need.id,
    solutionId: solution.id,
    evaluatedAt: evaluatedAt as QualifiedNeed['createdAt'],
    rulesVersion: MATCH_RULES_VERSION,
    catalogVersion: solution.catalogVersion,
    gates: eligibility.gates,
    ...baseExplanations(eligibility.gates.map((g) => `${g.code}: ${g.status} — ${g.reason}`)),
  };

  if (eligibility.outcome === 'ineligible') {
    return {
      ...meta,
      outcome: 'ineligible',
      failedGateCodes: eligibility.failedGateCodes,
    };
  }
  if (eligibility.outcome === 'needs_information') {
    return {
      ...meta,
      outcome: 'needs_information',
      missingInformation: eligibility.missingInformation,
    };
  }

  const scored = calculateCompatibilityScore(need, solution, eligibility.validEvidenceIds.length);
  return {
    ...meta,
    explanations: [...meta.explanations, ...scored.justification],
    outcome: 'eligible',
    score: scored.score,
    breakdown: scored.breakdown,
    recommendation: scored.recommendation,
  };
}

/**
 * Ordena elegíveis por score desc, depois solutionId asc (determinístico).
 */
export function rankSolutions(results: readonly MatchResult[]): Array<Extract<MatchResult, { outcome: 'eligible' }>> {
  return results
    .filter((r): r is Extract<MatchResult, { outcome: 'eligible' }> => r.outcome === 'eligible')
    .slice()
    .sort((a, b) => b.score - a.score || a.solutionId.localeCompare(b.solutionId));
}

/**
 * Avalia o catálogo completo. Need incompleto ⇒ insufficient_data (não “não-match”).
 */
export function evaluateCatalogMatch(
  need: Need,
  evaluatedAt: string,
  catalogue: readonly Solution[],
  evidence: readonly CatalogEvidence[],
  factsFor: OperationalFactsLookup,
): MatchEvaluation {
  if (need.status !== 'qualified') {
    return {
      status: 'insufficient_data',
      needId: need.id,
      missingInformation: need.missingFields,
      results: [],
    };
  }

  // Ordem canônica de avaliação por id — independência da ordem de entrada do catálogo.
  const ordered = [...catalogue].sort((a, b) => a.id.localeCompare(b.id));
  const results = ordered.map((solution) =>
    evaluateSolutionMatch(need, solution, evaluatedAt, evidence, factsFor(solution)),
  );

  const ranked = rankSolutions(results);
  const top = ranked[0];
  if (top) {
    return {
      status: top.recommendation === 'not_recommended' ? 'no_recommendation' : top.recommendation,
      needId: need.id,
      results,
      topSolutionId: top.solutionId,
    };
  }

  if (results.some((r) => r.outcome === 'needs_information')) {
    return {
      status: 'insufficient_data',
      needId: need.id,
      missingInformation: ['Há ficha/preço/implantação pendente de curadoria'],
      results,
    };
  }

  return { status: 'no_eligible_catalog_solution', needId: need.id, results };
}
