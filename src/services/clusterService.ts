/**
 * TEMPORÁRIO AG-09 — stand-in tipado até `suggestClusters` canônico do AG-07.
 * Contrato: `suggestClusters(needs) → DemandCluster[]`.
 * Agrupa por assinatura determinística; reporta variações e conflitos bloqueantes.
 */
import type { DemandCluster, QualifiedNeed, UUID } from '../domain/types';
import { PROCESS_FAMILY, deriveDemoClusterKey } from '../data/registries';

function collectConflicts(members: QualifiedNeed[]): string[] {
  const conflicts: string[] = [];
  const metrics = new Set(members.map((n) => n.metric.code));
  if (metrics.size > 1) conflicts.push('Indicadores de sucesso distintos entre registros do grupo');

  const sharings = new Set(members.map((n) => n.constraints.dataSharing));
  if (sharings.size > 1) conflicts.push('Limites de compartilhamento de dados divergentes');

  const offline = new Set(members.map((n) => n.constraints.offlineRequired));
  if (offline.size > 1) conflicts.push('Requisito de operação offline divergente');

  const mobiles = new Set(members.map((n) => n.constraints.mobileRequired));
  if (mobiles.size > 1) conflicts.push('Requisito de acesso móvel divergente');

  const budgets = new Set(members.map((n) => n.constraints.budgetBand));
  if (budgets.size > 1) conflicts.push('Faixas de orçamento distintas (revisão necessária)');

  const mandatories = members.map((n) =>
    n.requirements
      .filter((r) => r.kind === 'mandatory')
      .map((r) => r.code)
      .sort()
      .join('|'),
  );
  if (new Set(mandatories).size > 1) {
    conflicts.push('Conjuntos de requisitos obrigatórios não idênticos');
  }

  return conflicts;
}

function collectVariations(members: QualifiedNeed[]): string[] {
  const variations: string[] = [];
  const segments = [...new Set(members.map((n) => n.segmentCode))];
  if (segments.length > 1) variations.push(`Segmentos: ${segments.join(', ')}`);
  const processes = [...new Set(members.map((n) => n.processCode))];
  if (processes.length > 1) variations.push(`Processos: ${processes.join(', ')}`);
  const sizes = [...new Set(members.map((n) => n.sizeCode))];
  if (sizes.length > 1) variations.push(`Portes: ${sizes.join(', ')}`);
  const trainings = [...new Set(members.map((n) => String(n.constraints.trainingMaxHours)))];
  if (trainings.length > 1) variations.push(`Teto de treinamento (h): ${trainings.join(', ')}`);
  return variations;
}

export function suggestClusters(needs: QualifiedNeed[]): DemandCluster[] {
  const buckets = new Map<string, QualifiedNeed[]>();
  for (const need of needs) {
    const signature =
      need.demoClusterKey ||
      deriveDemoClusterKey(need.painCode, need.processCode, need.hasErp, need.channelCode);
    const list = buckets.get(signature) ?? [];
    list.push(need);
    buckets.set(signature, list);
  }

  const clusters: DemandCluster[] = [];
  for (const [signature, members] of [...buckets.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    if (members.length === 0) continue;
    const first = members[0]!;
    const processFamily = PROCESS_FAMILY[first.processCode];
    const associations = [...new Set(members.map((n) => n.associationCode))].sort();
    const needIds = [...members]
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt) || String(a.id).localeCompare(String(b.id)))
      .map((n) => n.id);

    clusters.push({
      id: `cluster:${signature}`,
      signature,
      needIds: needIds as UUID[],
      associationCodes: associations,
      painCode: first.painCode,
      processFamily,
      erpContext: first.hasErp ? 'erp' : 'no_erp',
      channelCode: first.channelCode,
      metricCode: first.metric.code,
      variations: collectVariations(members),
      blockingConflicts: collectConflicts(members),
      distinctRecordCount: new Set(needIds).size,
      review: { mode: 'simulated', status: 'suggested' },
    });
  }
  return clusters;
}
