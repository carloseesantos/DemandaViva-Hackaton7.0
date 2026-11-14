/** Domínio determinístico AG-07 — reexportações públicas (sem React/I/O). */
export * from './types';
export * from './matchRules';
export { validateNeed, qualifyNeed, deriveClusterKey } from './validateNeed';
export type { ValidateNeedResult, QualifyNeedInput, QualifyNeedResult } from './validateNeed';
export { evaluateEligibility, selectValidEvidence } from './eligibility';
export type { SolutionOperationalFacts, EligibilityOutcome } from './eligibility';
export { calculateCompatibilityScore } from './score';
export type { CompatibilityScore } from './score';
export { evaluateSolutionMatch, evaluateCatalogMatch, rankSolutions } from './matching';
export type { OperationalFactsLookup } from './matching';
export { generateBriefing } from './briefing';
export type { BriefingOutcome } from './briefing';
export { detectSimilarNeeds, buildDemandClusters } from './clustering';
export type { ClusterExplanation } from './clustering';
