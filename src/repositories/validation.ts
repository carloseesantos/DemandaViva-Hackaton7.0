import { SCHEMA_VERSION } from '../domain/types';
import type {
  AssociationCode,
  BudgetBand,
  ChannelCode,
  DataSharing,
  FrequencyCode,
  MetricCode,
  NewQualifiedNeed,
  PainCode,
  ProcessCode,
  RequirementCode,
  SegmentCode,
  SizeCode,
} from '../domain/types';
import { PAIN_TEMPLATES } from '../data/registries';
import { DemandValidationError } from './errors';

const ASSOCIATION: ReadonlySet<string> = new Set<AssociationCode>(['ac_alfa', 'ac_beta']);
const SEGMENT: ReadonlySet<string> = new Set<SegmentCode>([
  'stationery',
  'fashion',
  'housewares',
  'gifts',
  'grocery',
  'other',
]);
const SIZE: ReadonlySet<string> = new Set<SizeCode>(['micro', 'small']);
const CHANNEL: ReadonlySet<string> = new Set<ChannelCode>([
  'whatsapp',
  'counter',
  'ecommerce',
  'mixed',
]);
const PAIN: ReadonlySet<string> = new Set<PainCode>([
  'stock_confirmation_delay',
  'sales_reconciliation',
  'customer_follow_up',
]);
const PROCESS: ReadonlySet<string> = new Set<ProcessCode>([
  'visual_check',
  'spreadsheet_check',
  'manual_message',
  'erp_lookup',
  'other',
]);
const FREQUENCY: ReadonlySet<string> = new Set<FrequencyCode>(['daily', 'weekly', 'monthly']);
const REQUIREMENT: ReadonlySet<string> = new Set<RequirementCode>([
  'stock_lookup',
  'whatsapp_workflow',
  'multi_store',
  'no_erp_dependency',
  'mobile_access',
  'manual_stock_update',
  'privacy_preserving',
  'short_training',
]);
const METRIC: ReadonlySet<string> = new Set<MetricCode>([
  'confirmation_minutes',
  'hours_per_week',
  'error_rate_pct',
]);
const BUDGET: ReadonlySet<string> = new Set<BudgetBand>(['low', 'medium', 'high']);
const SHARING: ReadonlySet<string> = new Set<DataSharing>(['none', 'restricted', 'allowed']);

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Padrões óbvios de PII / texto livre — rejeitados no MVP (dados sintéticos apenas). */
const PII_HINT =
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b|\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\+?\d[\d\s()-]{8,}\d/i;

function push(issues: string[], ok: boolean, message: string): void {
  if (!ok) issues.push(message);
}

function requirementCodes(
  requirements: NewQualifiedNeed['requirements'],
  kind: 'mandatory' | 'optional',
): string[] {
  return requirements.filter((r) => r.kind === kind).map((r) => r.code);
}

export function collectNewQualifiedNeedIssues(need: NewQualifiedNeed): string[] {
  const issues: string[] = [];

  push(issues, need.schemaVersion === SCHEMA_VERSION, 'schemaVersion deve ser 1');
  push(issues, need.origin === 'remote', "origin deve ser 'remote' para INSERT");
  push(issues, need.status === 'qualified', "status deve ser 'qualified'");
  push(issues, need.isDemo === true, 'isDemo deve ser true');
  push(issues, UUID_RE.test(need.id), 'id deve ser UUID v4/v1 válido');
  push(issues, ASSOCIATION.has(need.associationCode), 'associationCode inválido');
  push(issues, SEGMENT.has(need.segmentCode), 'segmentCode inválido');
  push(issues, SIZE.has(need.sizeCode), 'sizeCode inválido');
  push(issues, CHANNEL.has(need.channelCode), 'channelCode inválido');
  push(issues, PAIN.has(need.painCode), 'painCode inválido');
  push(issues, PROCESS.has(need.processCode), 'processCode inválido');
  push(issues, FREQUENCY.has(need.frequencyCode), 'frequencyCode inválido');
  push(issues, METRIC.has(need.metric.code), 'metric.code inválido');
  push(issues, BUDGET.has(need.constraints.budgetBand), 'constraints.budgetBand inválido');
  push(issues, SHARING.has(need.constraints.dataSharing), 'constraints.dataSharing inválido');
  push(
    issues,
    typeof need.constraints.mobileRequired === 'boolean',
    'constraints.mobileRequired inválido',
  );
  push(
    issues,
    typeof need.constraints.offlineRequired === 'boolean',
    'constraints.offlineRequired inválido',
  );
  push(
    issues,
    Number.isInteger(need.constraints.trainingMaxHours) &&
      need.constraints.trainingMaxHours >= 0 &&
      need.constraints.trainingMaxHours <= 8,
    'constraints.trainingMaxHours deve ser 0..8',
  );

  const template = PAIN_TEMPLATES[need.painCode];
  push(
    issues,
    need.problemSummary === template && need.problemSummary.length <= 160,
    'problemSummary deve ser o template sintético do painCode (sem texto livre)',
  );
  push(issues, !PII_HINT.test(need.problemSummary), 'problemSummary não pode parecer PII');

  if (need.hasErp) {
    push(issues, need.erpCode === 'erp_x', "com hasErp=true, erpCode deve ser 'erp_x'");
  } else {
    push(issues, need.erpCode === null, 'sem ERP, erpCode deve ser null');
    push(issues, need.processCode !== 'erp_lookup', 'erp_lookup exige hasErp=true');
  }

  const mandatory = requirementCodes(need.requirements, 'mandatory');
  const optional = requirementCodes(need.requirements, 'optional');
  push(issues, mandatory.length > 0 && mandatory.length <= 8, 'mandatory requirements 1..8');
  push(issues, optional.length <= 8, 'optional requirements no máximo 8');
  push(
    issues,
    mandatory.every((c) => REQUIREMENT.has(c)) && optional.every((c) => REQUIREMENT.has(c)),
    'código de requisito desconhecido',
  );
  push(issues, new Set(mandatory).size === mandatory.length, 'mandatory com duplicata');
  push(issues, new Set(optional).size === optional.length, 'optional com duplicata');
  push(
    issues,
    mandatory.every((c) => !optional.includes(c)),
    'mandatory e optional devem ser disjuntos',
  );

  push(
    issues,
    need.metric.baseline > 0 &&
      need.metric.baseline <= 10000 &&
      need.metric.target >= 0 &&
      need.metric.target < need.metric.baseline,
    'métrica: 0 ≤ target < baseline ≤ 10000 e baseline > 0',
  );
  if (need.painCode === 'stock_confirmation_delay') {
    push(
      issues,
      need.metric.code === 'confirmation_minutes',
      'stock_confirmation_delay exige metric confirmation_minutes',
    );
  }

  return issues;
}

export function assertNewQualifiedNeed(need: NewQualifiedNeed): void {
  const issues = collectNewQualifiedNeedIssues(need);
  if (issues.length > 0) throw new DemandValidationError(issues);
}

export function isRequirementCode(value: string): value is RequirementCode {
  return REQUIREMENT.has(value);
}
