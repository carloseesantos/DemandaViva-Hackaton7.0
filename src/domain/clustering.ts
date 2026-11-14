/**
 * Agrupamento por problema + etapa/processo + restrições + resultado esperado.
 * Homônimos textuais com contexto incompatível NÃO entram no mesmo cluster.
 * Sempre sugere revisão humana (DemoReview simulated).
 */
import type { AssociationCode, DemandCluster, QualifiedNeed, UUID } from './types';
import { CLUSTER_SIGNATURE_VERSION, PROCESS_FAMILY } from './matchRules';
import { deriveClusterKey } from './validateNeed';

export type ClusterExplanation = {
  cluster: DemandCluster;
  /** Por que estes relatos foram agrupados. */
  whyGrouped: string[];
  /** Diferenças preservadas (não apagadas). */
  preservedDifferences: string[];
  /** Pedido explícito de revisão humana. */
  humanReviewHint: string;
};

function baseSignature(need: QualifiedNeed): string {
  return need.demoClusterKey || deriveClusterKey(need);
}

/** Partição dura: métrica + compartilhamento + offline (contradições eliminatórias). */
function hardPartitionKey(need: QualifiedNeed): string {
  return [
    need.metric.code,
    need.constraints.dataSharing,
    need.constraints.offlineRequired ? 'offline' : 'online',
  ].join('|');
}

function mandatoryKey(need: QualifiedNeed): string {
  return need.requirements
    .filter((r) => r.kind === 'mandatory')
    .map((r) => r.code)
    .sort()
    .join(',');
}

function collectConflicts(members: QualifiedNeed[]): string[] {
  const conflicts: string[] = [];
  if (new Set(members.map((n) => n.metric.code)).size > 1) {
    conflicts.push('Indicadores de sucesso distintos entre registros do grupo');
  }
  if (new Set(members.map((n) => n.constraints.dataSharing)).size > 1) {
    conflicts.push('Limites de compartilhamento de dados divergentes');
  }
  if (new Set(members.map((n) => n.constraints.offlineRequired)).size > 1) {
    conflicts.push('Requisito de operação offline divergente');
  }
  if (new Set(members.map((n) => n.constraints.mobileRequired)).size > 1) {
    conflicts.push('Requisito de acesso móvel divergente');
  }
  if (new Set(members.map((n) => n.constraints.budgetBand)).size > 1) {
    conflicts.push('Faixas de orçamento distintas (revisão necessária)');
  }
  if (new Set(members.map((n) => n.constraints.trainingMaxHours)).size > 1) {
    conflicts.push('Tetos de treinamento distintos (revisão necessária)');
  }
  if (new Set(members.map(mandatoryKey)).size > 1) {
    conflicts.push('Conjuntos de requisitos obrigatórios não idênticos');
  }
  return conflicts;
}

function collectVariations(members: QualifiedNeed[]): string[] {
  const variations: string[] = [];
  const segments = [...new Set(members.map((n) => n.segmentCode))].sort();
  if (segments.length > 1) variations.push(`Segmentos: ${segments.join(', ')}`);
  const processes = [...new Set(members.map((n) => n.processCode))].sort();
  if (processes.length > 1) variations.push(`Processos: ${processes.join(', ')}`);
  const sizes = [...new Set(members.map((n) => n.sizeCode))].sort();
  if (sizes.length > 1) variations.push(`Portes: ${sizes.join(', ')}`);
  const trainings = [...new Set(members.map((n) => String(n.constraints.trainingMaxHours)))].sort();
  if (trainings.length > 1) variations.push(`Teto de treinamento (h): ${trainings.join(', ')}`);
  const budgets = [...new Set(members.map((n) => n.constraints.budgetBand))].sort();
  if (budgets.length > 1) variations.push(`Orçamentos: ${budgets.join(', ')}`);
  const mobiles = [...new Set(members.map((n) => String(n.constraints.mobileRequired)))].sort();
  if (mobiles.length > 1) variations.push(`mobileRequired: ${mobiles.join(', ')}`);
  return variations;
}

function buildCluster(signature: string, members: QualifiedNeed[]): DemandCluster {
  const sorted = [...members].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || String(a.id).localeCompare(String(b.id)),
  );
  const first = sorted[0]!;
  const associations = [...new Set(sorted.map((n) => n.associationCode))].sort() as AssociationCode[];
  const needIds = sorted.map((n) => n.id) as UUID[];
  const processFamily = PROCESS_FAMILY[first.processCode];

  return {
    id: `cluster:${signature}`,
    signature,
    needIds,
    associationCodes: associations,
    painCode: first.painCode,
    processFamily,
    erpContext: first.hasErp ? 'erp' : 'no_erp',
    channelCode: first.channelCode,
    metricCode: first.metric.code,
    variations: collectVariations(sorted),
    blockingConflicts: collectConflicts(sorted),
    distinctRecordCount: new Set(needIds).size,
    review: { mode: 'simulated', status: 'suggested' },
  };
}

/**
 * Detecta agrupamentos similares de forma determinística (independente da ordem de entrada).
 */
export function detectSimilarNeeds(needs: readonly QualifiedNeed[]): ClusterExplanation[] {
  // Dedup por UUID (último vence) e ordenação canônica antes de agrupar.
  const byId = new Map<string, QualifiedNeed>();
  for (const need of needs) {
    byId.set(String(need.id), need);
  }
  const ordered = [...byId.values()].sort(
    (a, b) => a.createdAt.localeCompare(b.createdAt) || String(a.id).localeCompare(String(b.id)),
  );

  type Bucket = { base: string; hard: string; members: QualifiedNeed[] };
  const buckets = new Map<string, Bucket>();

  for (const need of ordered) {
    const base = baseSignature(need);
    const hard = hardPartitionKey(need);
    const key = `${base}::${hard}`;
    const existing = buckets.get(key);
    if (existing) {
      existing.members.push(need);
    } else {
      buckets.set(key, { base, hard, members: [need] });
    }
  }

  const explanations: ClusterExplanation[] = [];
  for (const key of [...buckets.keys()].sort()) {
    const bucket = buckets.get(key)!;
    const signature =
      bucket.hard === hardPartitionKey(bucket.members[0]!) &&
      [...buckets.values()].filter((b) => b.base === bucket.base).length === 1
        ? bucket.base
        : `${bucket.base}|${bucket.hard}`;

    const cluster = buildCluster(signature, bucket.members);
    const whyGrouped = [
      `Assinatura ${CLUSTER_SIGNATURE_VERSION}: problema=${cluster.painCode}, processo=${cluster.processFamily}, ERP=${cluster.erpContext}, canal=${cluster.channelCode}.`,
      `Resultado esperado alinhado em metric=${cluster.metricCode}; restrições duras dataSharing/offline compatíveis no subconjunto.`,
      `Agrupamento candidato com ${cluster.distinctRecordCount} registro(s) distinto(s) e ${cluster.associationCodes.length} associação(ões).`,
    ];
    const preservedDifferences = [
      ...cluster.variations,
      ...cluster.blockingConflicts.map((c) => `Conflito a revisar: ${c}`),
    ];
    explanations.push({
      cluster,
      whyGrouped,
      preservedDifferences,
      humanReviewHint:
        'Sugestão automática apenas — revisão humana da AC (simulada) é obrigatória antes de qualquer chamada a startup.',
    });
  }

  return explanations;
}

/** API de serviço: apenas clusters, na ordem determinística das explicações. */
export function buildDemandClusters(needs: readonly QualifiedNeed[]): DemandCluster[] {
  return detectSimilarNeeds(needs).map((x) => x.cluster);
}
