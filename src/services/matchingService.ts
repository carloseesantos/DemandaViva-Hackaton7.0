/**
 * MatchingService canônico AG-07.
 * API estável consumida pela UI: `evaluateNeed`, `evaluateSolution`.
 */
import type {
  CatalogEvidence,
  MatchEvaluation,
  MatchResult,
  Need,
  QualifiedNeed,
  Solution,
} from '../domain/types';
import {
  evaluateCatalogMatch,
  evaluateSolutionMatch,
  type SolutionOperationalFacts,
} from '../domain';
import { catalogEvidence, solutionDisplayDetails, solutions } from '../data/solutions';

function factsFor(solution: Solution): SolutionOperationalFacts {
  const details = solutionDisplayDetails[solution.id];
  if (!details) {
    throw new Error(`Metadados operacionais ausentes para ${solution.id}`);
  }
  return {
    trainingHours: details.support.trainingHours,
    mobileSupported: details.mobileSupported,
    offlineSupported: details.offlineSupported,
  };
}

export function evaluateSolution(
  need: QualifiedNeed,
  solution: Solution,
  evaluatedAt: string,
  evidence: readonly CatalogEvidence[] = catalogEvidence,
): MatchResult {
  return evaluateSolutionMatch(need, solution, evaluatedAt, evidence, factsFor(solution));
}

/** API tipada consumida pela UI — assinatura estável desde AG-09. */
export function evaluateNeed(
  need: Need,
  evaluatedAt: string = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
  catalogue: Solution[] = solutions,
): MatchEvaluation {
  return evaluateCatalogMatch(need, evaluatedAt, catalogue, catalogEvidence, factsFor);
}
