/**
 * BriefService canônico AG-07.
 * Contrato: `buildBrief(need, evaluation) → Brief` (caminho B).
 * Diagnóstico incompleto não deve chamar esta API — use `generateBriefing` no domínio.
 */
import type { Brief, ISODateTime, MatchEvaluation, QualifiedNeed } from '../domain/types';
import { generateBriefing } from '../domain';

export function buildBrief(
  need: QualifiedNeed,
  evaluation: MatchEvaluation,
  generatedAt: string = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
): Brief {
  const outcome = generateBriefing(need, evaluation, generatedAt as ISODateTime);
  if (outcome.kind !== 'brief') {
    throw new Error(outcome.reason);
  }
  return outcome.brief;
}
