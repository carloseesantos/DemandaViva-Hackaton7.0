/**
 * Serviços determinísticos AG-07 — API pública para a UI.
 * Assinaturas estáveis: evaluateNeed, evaluateSolution, buildBrief, suggestClusters.
 */
export { evaluateNeed, evaluateSolution } from './matchingService';
export { buildBrief } from './briefService';
export { suggestClusters, explainClusters } from './clusterService';
