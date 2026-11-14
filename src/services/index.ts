/**
 * Serviços tipados para a UI.
 * matching/brief/cluster abaixo são TEMPORÁRIOS (AG-09) até handoff AG-07 —
 * substituir implementação sem alterar assinaturas exportadas.
 */
export { evaluateNeed, evaluateSolution } from './matchingService';
export { buildBrief } from './briefService';
export { suggestClusters } from './clusterService';
