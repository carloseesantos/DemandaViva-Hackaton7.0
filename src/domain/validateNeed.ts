/**
 * Validação e qualificação puras de NeedDraft → QualifiedNeed | insufficient_data.
 * Sem I/O, sem Date.now()/Math.random — relógio e IDs são injetados.
 */
import { SCHEMA_VERSION } from './types';
import type {
  ISODateTime,
  NeedDraft,
  NeedOrigin,
  PainCode,
  QualifiedNeed,
  Requirement,
  UUID,
} from './types';
import { PROCESS_FAMILY } from './matchRules';

const REQUIRED_KEYS = [
  'associationCode',
  'segmentCode',
  'sizeCode',
  'channelCode',
  'painCode',
  'processCode',
  'frequencyCode',
  'hasErp',
  'requirements',
  'constraints',
  'metric',
] as const;

export type ValidateNeedResult =
  | { ok: true; missingFields: [] }
  | { ok: false; missingFields: string[]; reasons: string[] };

export type QualifyNeedInput = {
  draft: NeedDraft;
  id: UUID;
  createdAt: ISODateTime;
  origin: NeedOrigin;
  /** Template canônico do painCode — nunca texto livre arbitrário. */
  problemSummary: string;
};

export type QualifyNeedResult =
  | { status: 'qualified'; need: QualifiedNeed }
  | { status: 'insufficient_data'; draft: NeedDraft; missingFields: string[]; reasons: string[] };

function deriveClusterKey(need: Pick<QualifiedNeed, 'painCode' | 'processCode' | 'hasErp' | 'channelCode'>): string {
  const family = PROCESS_FAMILY[need.processCode];
  const erp = need.hasErp ? 'erp' : 'no_erp';
  return `${need.painCode}|${family}|${erp}|${need.channelCode}`;
}

export function validateNeed(draft: NeedDraft): ValidateNeedResult {
  const fields = draft.fields;
  const missingFields: string[] = [];
  const reasons: string[] = [];

  for (const key of REQUIRED_KEYS) {
    if (key === 'requirements') {
      const reqs = fields.requirements ?? [];
      if (!reqs.some((r) => r.kind === 'mandatory')) {
        missingFields.push('requirements');
        reasons.push('É necessário ao menos um requisito obrigatório.');
      }
      continue;
    }
    if (key === 'hasErp') {
      if (fields.hasErp === undefined) {
        missingFields.push('hasErp');
        reasons.push('Informe se há ERP no cenário.');
      } else if (fields.hasErp === true && !fields.erpCode) {
        missingFields.push('erpCode');
        reasons.push('ERP declarado sem código de sistema.');
      }
      continue;
    }
    if (fields[key] === undefined || fields[key] === null) {
      missingFields.push(key);
    }
  }

  if (fields.hasErp === false && fields.processCode === 'erp_lookup') {
    reasons.push('Processo erp_lookup é inconsistente com hasErp=false.');
  }

  const codes = (fields.requirements ?? []).map((r) => r.code);
  if (new Set(codes).size !== codes.length) {
    reasons.push('Há códigos de requisito duplicados.');
  }

  const metric = fields.metric;
  if (metric) {
    if (!Number.isFinite(metric.baseline) || !Number.isFinite(metric.target)) {
      reasons.push('Indicador com baseline/target inválidos.');
    } else if (metric.target >= metric.baseline) {
      reasons.push('A meta deve ser menor que a linha de base neste indicador.');
    }
  }

  if (missingFields.length === 0 && reasons.length === 0) {
    return { ok: true, missingFields: [] };
  }
  return {
    ok: false,
    missingFields: [...new Set(missingFields)],
    reasons:
      reasons.length > 0
        ? reasons
        : ['Dados insuficientes para qualificar a necessidade (insufficient_data).'],
  };
}

/**
 * Qualifica um rascunho somente quando validação passa.
 * Caso contrário devolve NeedDraft com status insufficient_data — nunca “não-match”.
 */
export function qualifyNeed(input: QualifyNeedInput): QualifyNeedResult {
  const fields = { ...input.draft.fields };
  if (fields.hasErp === false) fields.erpCode = null;
  if (fields.painCode) fields.problemSummary = input.problemSummary;

  const validation = validateNeed({ ...input.draft, fields });
  if (!validation.ok) {
    return {
      status: 'insufficient_data',
      draft: {
        ...input.draft,
        fields,
        status: 'insufficient_data',
        missingFields: validation.missingFields,
      },
      missingFields: validation.missingFields,
      reasons: validation.reasons,
    };
  }

  const requirements = fields.requirements as Requirement[];
  const need: QualifiedNeed = {
    id: input.id,
    schemaVersion: SCHEMA_VERSION,
    origin: input.origin,
    createdAt: input.createdAt,
    status: 'qualified',
    isDemo: true,
    associationCode: fields.associationCode!,
    segmentCode: fields.segmentCode!,
    sizeCode: fields.sizeCode!,
    channelCode: fields.channelCode!,
    painCode: fields.painCode as PainCode,
    processCode: fields.processCode!,
    frequencyCode: fields.frequencyCode!,
    hasErp: fields.hasErp!,
    erpCode: fields.hasErp ? fields.erpCode! : null,
    problemSummary: input.problemSummary,
    requirements,
    constraints: fields.constraints!,
    metric: fields.metric!,
    demoClusterKey: deriveClusterKey({
      painCode: fields.painCode!,
      processCode: fields.processCode!,
      hasErp: Boolean(fields.hasErp),
      channelCode: fields.channelCode!,
    }),
  };

  return { status: 'qualified', need };
}

export { deriveClusterKey };
