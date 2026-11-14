import { SCHEMA_VERSION } from '../domain/types';
import type {
  AssociationCode,
  ChannelCode,
  FrequencyCode,
  ISODateTime,
  MetricCode,
  NeedConstraints,
  NewQualifiedNeed,
  PainCode,
  ProcessCode,
  QualifiedNeed,
  Requirement,
  RequirementCode,
  SegmentCode,
  SizeCode,
  UUID,
} from '../domain/types';
import { makeDemoRequirement } from '../data/registries';
import { DemandMappingError } from './errors';
import { assertNewQualifiedNeed, isRequirementCode } from './validation';

/** Colunas explícitas permitidas no INSERT (DATA_MODEL §6). Sem created_at/owner_id/demo_cluster_key. */
export interface DemoDemandInsertPayload {
  id: string;
  schema_version: 1;
  source_code: 'demo_session';
  association_code: AssociationCode;
  segment_code: SegmentCode;
  size_code: SizeCode;
  channel_code: ChannelCode;
  pain_code: PainCode;
  process_code: ProcessCode;
  frequency_code: FrequencyCode;
  has_erp: boolean;
  erp_code: 'erp_x' | null;
  problem_summary: string;
  mandatory_requirements: RequirementCode[];
  optional_requirements: RequirementCode[];
  constraints: NeedConstraints;
  metric_code: MetricCode;
  baseline: number;
  target: number;
  status: 'qualified';
  is_demo: true;
}

/** Projeção de linha retornada pelo SELECT (próprio ou RPC futura). */
export interface DemoDemandRow {
  id: string;
  created_at: string;
  schema_version: number;
  source_code: string;
  association_code: string;
  segment_code: string;
  size_code: string;
  channel_code: string;
  pain_code: string;
  process_code: string;
  frequency_code: string;
  has_erp: boolean;
  erp_code: string | null;
  problem_summary: string;
  mandatory_requirements: unknown;
  optional_requirements: unknown;
  constraints: unknown;
  metric_code: string;
  baseline: number | string;
  target: number | string;
  demo_cluster_key: string;
  status: string;
  is_demo: boolean;
}

function codesOf(requirements: Requirement[], kind: Requirement['kind']): RequirementCode[] {
  return requirements.filter((r) => r.kind === kind).map((r) => r.code);
}

export function serializeForInsert(need: NewQualifiedNeed): DemoDemandInsertPayload {
  assertNewQualifiedNeed(need);
  return {
    id: need.id,
    schema_version: SCHEMA_VERSION,
    source_code: 'demo_session',
    association_code: need.associationCode,
    segment_code: need.segmentCode,
    size_code: need.sizeCode,
    channel_code: need.channelCode,
    pain_code: need.painCode,
    process_code: need.processCode,
    frequency_code: need.frequencyCode,
    has_erp: need.hasErp,
    erp_code: need.erpCode,
    problem_summary: need.problemSummary,
    mandatory_requirements: codesOf(need.requirements, 'mandatory'),
    optional_requirements: codesOf(need.requirements, 'optional'),
    constraints: {
      budgetBand: need.constraints.budgetBand,
      dataSharing: need.constraints.dataSharing,
      mobileRequired: need.constraints.mobileRequired,
      offlineRequired: need.constraints.offlineRequired,
      trainingMaxHours: need.constraints.trainingMaxHours,
    },
    metric_code: need.metric.code,
    baseline: need.metric.baseline,
    target: need.metric.target,
    status: 'qualified',
    is_demo: true,
  };
}

function asStringArray(value: unknown, field: string): string[] {
  if (!Array.isArray(value)) throw new DemandMappingError(`${field} deve ser array`);
  if (!value.every((item) => typeof item === 'string')) {
    throw new DemandMappingError(`${field} deve conter apenas strings`);
  }
  return value;
}

function parseConstraints(value: unknown): NeedConstraints {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new DemandMappingError('constraints inválido');
  }
  const c = value as Record<string, unknown>;
  const keys = Object.keys(c);
  if (keys.length !== 5) throw new DemandMappingError('constraints deve ter exatamente 5 chaves');
  const budgetBand = c.budgetBand;
  const dataSharing = c.dataSharing;
  const mobileRequired = c.mobileRequired;
  const offlineRequired = c.offlineRequired;
  const trainingMaxHours = c.trainingMaxHours;
  if (
    typeof budgetBand !== 'string' ||
    typeof dataSharing !== 'string' ||
    typeof mobileRequired !== 'boolean' ||
    typeof offlineRequired !== 'boolean' ||
    typeof trainingMaxHours !== 'number'
  ) {
    throw new DemandMappingError('constraints com tipos inválidos');
  }
  return {
    budgetBand: budgetBand as NeedConstraints['budgetBand'],
    dataSharing: dataSharing as NeedConstraints['dataSharing'],
    mobileRequired,
    offlineRequired,
    trainingMaxHours: trainingMaxHours as NeedConstraints['trainingMaxHours'],
  };
}

function parseNumber(value: number | string, field: string): number {
  const n = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(n)) throw new DemandMappingError(`${field} numérico inválido`);
  return n;
}

/**
 * Reidrata QualifiedNeed a partir da row. Códigos desconhecidos → erro explícito (nunca 'other').
 * origin sempre 'remote'; createdAt e demoClusterKey vêm do servidor.
 */
export function deserializeRow(row: DemoDemandRow): QualifiedNeed {
  if (row.schema_version !== SCHEMA_VERSION) {
    throw new DemandMappingError(`schema_version ${String(row.schema_version)} não suportado`);
  }
  if (row.status !== 'qualified') throw new DemandMappingError(`status remoto inválido: ${row.status}`);
  if (row.is_demo !== true) throw new DemandMappingError('is_demo deve ser true');
  if (row.source_code !== 'demo_session') {
    throw new DemandMappingError(`source_code inválido: ${row.source_code}`);
  }
  if (!row.id || !row.created_at || !row.demo_cluster_key) {
    throw new DemandMappingError('row incompleta (id/created_at/demo_cluster_key)');
  }

  const id = row.id as UUID;
  const mandatoryRaw = asStringArray(row.mandatory_requirements, 'mandatory_requirements');
  const optionalRaw = asStringArray(row.optional_requirements, 'optional_requirements');
  for (const code of [...mandatoryRaw, ...optionalRaw]) {
    if (!isRequirementCode(code)) {
      throw new DemandMappingError(`RequirementCode desconhecido: ${code}`);
    }
  }
  const mandatory = mandatoryRaw as RequirementCode[];
  const optional = optionalRaw as RequirementCode[];
  const requirements: Requirement[] = [
    ...mandatory.map((code) => makeDemoRequirement(id, code, 'mandatory')),
    ...optional.map((code) => makeDemoRequirement(id, code, 'optional')),
  ];

  const need: QualifiedNeed = {
    id,
    schemaVersion: SCHEMA_VERSION,
    origin: 'remote',
    createdAt: row.created_at as ISODateTime,
    status: 'qualified',
    isDemo: true,
    associationCode: row.association_code as AssociationCode,
    segmentCode: row.segment_code as SegmentCode,
    sizeCode: row.size_code as SizeCode,
    channelCode: row.channel_code as ChannelCode,
    painCode: row.pain_code as PainCode,
    processCode: row.process_code as ProcessCode,
    frequencyCode: row.frequency_code as FrequencyCode,
    hasErp: row.has_erp,
    erpCode: row.has_erp ? 'erp_x' : null,
    problemSummary: row.problem_summary,
    requirements,
    constraints: parseConstraints(row.constraints),
    metric: {
      code: row.metric_code as MetricCode,
      baseline: parseNumber(row.baseline, 'baseline'),
      target: parseNumber(row.target, 'target'),
    },
    demoClusterKey: row.demo_cluster_key,
  };

  // Revalida como NewQualifiedNeed (ignora createdAt/demoClusterKey na asserção de insert).
  assertNewQualifiedNeed({
    ...need,
    origin: 'remote',
  });

  return need;
}
