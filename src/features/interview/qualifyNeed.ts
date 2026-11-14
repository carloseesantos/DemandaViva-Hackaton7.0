import type {
  NeedDraft,
  NeedConstraints,
  QualifiedNeed,
  Requirement,
  RequirementCode,
  SuccessMetric,
  UUID,
} from '../../domain/types';
import { SCHEMA_VERSION } from '../../domain/types';
import { deriveDemoClusterKey, makeDemoRequirement, PAIN_TEMPLATES } from '../../data/registries';

export type QualifyResult =
  | { ok: true; need: QualifiedNeed }
  | { ok: false; draft: NeedDraft; missingFields: string[]; messages: string[] };

const REQUIRED_FIELD_KEYS = [
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

export function computeMissingFields(fields: NeedDraft['fields']): string[] {
  const missing: string[] = [];
  for (const key of REQUIRED_FIELD_KEYS) {
    if (key === 'requirements') {
      const reqs = fields.requirements ?? [];
      if (!reqs.some((r) => r.kind === 'mandatory')) missing.push('requirements');
      continue;
    }
    if (key === 'hasErp') {
      if (fields.hasErp === undefined) missing.push('hasErp');
      else if (fields.hasErp === true && !fields.erpCode) missing.push('erpCode');
      continue;
    }
    if (fields[key] === undefined || fields[key] === null) missing.push(key);
  }
  return missing;
}

export function validateDraftMessages(fields: NeedDraft['fields']): string[] {
  const messages: string[] = [];
  if (
    fields.associationCode === undefined ||
    fields.segmentCode === undefined ||
    fields.channelCode === undefined ||
    fields.painCode === undefined
  ) {
    messages.push('Escolha uma opção para continuar o diagnóstico.');
  }
  if (fields.hasErp === false && fields.processCode === 'erp_lookup') {
    messages.push('Você informou que não usa ERP. Escolha como consulta as informações hoje.');
  }
  if (fields.hasErp === true && !fields.erpCode) {
    messages.push("Selecione o ERP do cenário ou volte e marque 'Não'.");
  }
  const mandatory = (fields.requirements ?? []).filter((r) => r.kind === 'mandatory');
  if (mandatory.length === 0) messages.push('Marque ao menos um requisito indispensável.');
  const codes = (fields.requirements ?? []).map((r) => r.code);
  if (new Set(codes).size !== codes.length) {
    messages.push('Este requisito já foi selecionado em outra categoria.');
  }
  if (!fields.constraints?.budgetBand) {
    messages.push('Informe um teto mensal fictício para avaliar o custo.');
  }
  const metric = fields.metric;
  if (!metric || !Number.isFinite(metric.baseline) || !Number.isFinite(metric.target)) {
    messages.push('Informe o indicador, o valor atual e a meta numérica.');
  } else if (metric.target >= metric.baseline) {
    messages.push('A meta precisa ser menor que o valor atual para este indicador.');
  }
  return messages;
}

export function qualifyDraft(draft: NeedDraft, stableId?: UUID): QualifyResult {
  const fields = { ...draft.fields };
  if (fields.hasErp === false) fields.erpCode = null;
  if (fields.painCode) fields.problemSummary = PAIN_TEMPLATES[fields.painCode];

  const missingFields = computeMissingFields(fields);
  const messages = validateDraftMessages(fields);

  if (missingFields.length > 0 || messages.length > 0) {
    return {
      ok: false,
      draft: {
        ...draft,
        fields,
        status: 'insufficient_data',
        missingFields,
      },
      missingFields,
      messages: messages.length
        ? messages
        : ['Ainda faltam informações para concluir o diagnóstico.'],
    };
  }

  const id = (stableId ?? draft.id) as UUID;
  const constraints = fields.constraints as NeedConstraints;
  const metric = fields.metric as SuccessMetric;
  const requirements = (fields.requirements as Requirement[]).map((r) =>
    makeDemoRequirement(id, r.code as RequirementCode, r.kind, r.priority),
  );

  const need: QualifiedNeed = {
    id,
    schemaVersion: SCHEMA_VERSION,
    origin: 'remote',
    createdAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') as QualifiedNeed['createdAt'],
    status: 'qualified',
    isDemo: true,
    associationCode: fields.associationCode!,
    segmentCode: fields.segmentCode!,
    sizeCode: fields.sizeCode!,
    channelCode: fields.channelCode!,
    painCode: fields.painCode!,
    processCode: fields.processCode!,
    frequencyCode: fields.frequencyCode!,
    hasErp: fields.hasErp!,
    erpCode: fields.hasErp ? fields.erpCode! : null,
    problemSummary: PAIN_TEMPLATES[fields.painCode!],
    requirements,
    constraints,
    metric,
    demoClusterKey: deriveDemoClusterKey(
      fields.painCode!,
      fields.processCode!,
      Boolean(fields.hasErp),
      fields.channelCode!,
    ),
  };

  return { ok: true, need };
}

/** Cenário B pré-preenchido (nova demanda — UUID novo na confirmação). */
export function prefillScenarioB(draftId: UUID): NeedDraft {
  const mandatory: RequirementCode[] = [
    'stock_lookup',
    'whatsapp_workflow',
    'no_erp_dependency',
    'mobile_access',
  ];
  const optional: RequirementCode[] = ['manual_stock_update', 'short_training'];
  return {
    id: draftId,
    schemaVersion: SCHEMA_VERSION,
    status: 'draft',
    localOnly: true,
    isDemo: true,
    fields: {
      associationCode: 'ac_beta',
      segmentCode: 'grocery',
      sizeCode: 'micro',
      channelCode: 'whatsapp',
      painCode: 'stock_confirmation_delay',
      processCode: 'spreadsheet_check',
      frequencyCode: 'daily',
      hasErp: false,
      erpCode: null,
      problemSummary: PAIN_TEMPLATES.stock_confirmation_delay,
      requirements: [
        ...mandatory.map((code) => makeDemoRequirement(draftId, code, 'mandatory')),
        ...optional.map((code) => makeDemoRequirement(draftId, code, 'optional')),
      ],
      constraints: {
        budgetBand: 'low',
        dataSharing: 'restricted',
        mobileRequired: true,
        offlineRequired: false,
        trainingMaxHours: 2,
      },
      metric: { code: 'confirmation_minutes', baseline: 7, target: 2 },
    },
    missingFields: [],
  };
}
