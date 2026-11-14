/**
 * Score de compatibilidade — SOMENTE após seis gates pass.
 * Pesos 30/20/20/15/15; notas inteiras 0–5; score = Σ(weight * rating / 5).
 */
import type { QualifiedNeed, ScoreComponent, Solution } from './types';
import { MATCH_BUDGET_CAP_CENTS, SCORE_BANDS, SCORE_WEIGHTS } from './matchRules';

export type CompatibilityScore = {
  score: number;
  breakdown: ScoreComponent[];
  recommendation: 'recommended' | 'conditional' | 'not_recommended';
  justification: string[];
};

function ratingFunctional(need: QualifiedNeed, solution: Solution): ScoreComponent['rating'] {
  const optional = need.requirements.filter((r) => r.kind === 'optional');
  const totalOptional = optional.reduce((sum, r) => sum + (4 - r.priority), 0);
  if (totalOptional === 0) return 5;
  const coveredOptional = optional
    .filter((r) => solution.coveredRequirements.includes(r.code))
    .reduce((sum, r) => sum + (4 - r.priority), 0);
  return Math.max(1, Math.round((5 * coveredOptional) / totalOptional)) as ScoreComponent['rating'];
}

function ratingEconomic(need: QualifiedNeed, solution: Solution): ScoreComponent['rating'] {
  const monthly = solution.minimumMonthlyCostCents;
  if (monthly === null) throw new Error('Nunca pontuar custo unknown');
  const ratio = monthly / MATCH_BUDGET_CAP_CENTS[need.constraints.budgetBand];
  if (ratio <= 0.3) return 5;
  if (ratio <= 0.6) return 4;
  if (ratio <= 0.8) return 3;
  if (ratio <= 1) return 2;
  return 0;
}

function ratingOperation(solution: Solution): ScoreComponent['rating'] {
  const hours = solution.implantationHours;
  if (hours === null) throw new Error('Nunca pontuar implantação unknown');
  if (hours <= 4) return 5;
  if (hours <= 12) return 4;
  if (hours <= 24) return 3;
  if (hours <= 48) return 2;
  return 1;
}

function ratingEvidence(validEvidenceCount: number): ScoreComponent['rating'] {
  if (validEvidenceCount >= 4) return 5;
  if (validEvidenceCount === 3) return 4;
  if (validEvidenceCount === 2) return 3;
  if (validEvidenceCount === 1) return 2;
  return 0;
}

/**
 * Calcula breakdown e score. Chamador DEVE garantir elegibilidade prévia.
 */
export function calculateCompatibilityScore(
  need: QualifiedNeed,
  solution: Solution,
  validEvidenceCount: number,
): CompatibilityScore {
  const ratings = {
    functional: ratingFunctional(need, solution),
    technical: 5 as ScoreComponent['rating'], // gate técnico já assegurou dependências
    economic: ratingEconomic(need, solution),
    operation: ratingOperation(solution),
    evidence: ratingEvidence(validEvidenceCount),
  };

  const breakdown: ScoreComponent[] = SCORE_WEIGHTS.map(({ criterion, weight }) => {
    const rating = ratings[criterion];
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      throw new Error(`Rating inválido para ${criterion}`);
    }
    return { criterion, weight, rating, points: (weight * rating) / 5 };
  });

  const score = Math.round(breakdown.reduce((sum, x) => sum + x.points, 0) * 10) / 10;
  const recommendation =
    score >= SCORE_BANDS.recommended
      ? 'recommended'
      : score >= SCORE_BANDS.conditional
        ? 'conditional'
        : 'not_recommended';

  const justification = breakdown.map(
    (c) =>
      `${c.criterion}: nota ${c.rating}/5 × peso ${c.weight} = ${c.points} pontos (simulado match-v1)`,
  );
  justification.push(
    `Score total calculado ${score}/100 → ${recommendation} (sujeito à revisão AC simulada; não é critério oficial FACESP)`,
  );

  return { score, breakdown, recommendation, justification };
}
