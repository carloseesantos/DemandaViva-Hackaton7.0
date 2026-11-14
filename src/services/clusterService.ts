/**
 * ClusterService canônico AG-07.
 * Contrato: `suggestClusters(needs) → DemandCluster[]`.
 */
import type { DemandCluster, QualifiedNeed } from '../domain/types';
import { buildDemandClusters, detectSimilarNeeds, type ClusterExplanation } from '../domain';

export function suggestClusters(needs: QualifiedNeed[]): DemandCluster[] {
  return buildDemandClusters(needs);
}

/** Explicações transparentes por agrupamento (revisão humana sugerida). */
export function explainClusters(needs: QualifiedNeed[]): ClusterExplanation[] {
  return detectSimilarNeeds(needs);
}
