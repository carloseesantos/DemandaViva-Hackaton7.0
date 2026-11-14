/**
 * Regras match-v1 (Doc 02 / DATA_MODEL §5) — propostas da equipe, NÃO critérios oficiais FACESP.
 * Alterar pesos, faixas ou tetos exige decisão PMO e incremento de MATCH_RULES_VERSION.
 */
import type { BudgetBand, DataSharing, ProcessCode, RequirementCode, ScoreCriterion } from './types';

export const SCORE_WEIGHTS: ReadonlyArray<{ criterion: ScoreCriterion; weight: 30 | 20 | 15 }> = [
  { criterion: 'functional', weight: 30 },
  { criterion: 'technical', weight: 20 },
  { criterion: 'economic', weight: 20 },
  { criterion: 'operation', weight: 15 },
  { criterion: 'evidence', weight: 15 },
];

/** Faixas propostas: ≥80 recommended; ≥65 conditional; abaixo not_recommended. */
export const SCORE_BANDS = { recommended: 80, conditional: 65 } as const;

/** Tetos mensais sintéticos (centavos) alinhados a catalog-enums / DEC-DATA-008. */
export const MATCH_BUDGET_CAP_CENTS: Readonly<Record<BudgetBand, number>> = {
  low: 20_000,
  medium: 50_000,
  high: 100_000,
};

export const DEMO_COVERAGE_REGION = 'regional_demo' as const;

export const PROCESS_FAMILY: Readonly<Record<ProcessCode, 'manual' | 'digital'>> = {
  visual_check: 'manual',
  spreadsheet_check: 'manual',
  manual_message: 'manual',
  erp_lookup: 'digital',
  other: 'digital',
};

/** Códigos de função essencial avaliados no gate essential_function. */
export const ESSENTIAL_FUNCTION_CODES: ReadonlySet<RequirementCode> = new Set([
  'stock_lookup',
  'whatsapp_workflow',
  'multi_store',
  'manual_stock_update',
]);

export const DATA_SHARING_RANK: Readonly<Record<DataSharing, number>> = {
  none: 0,
  restricted: 1,
  allowed: 2,
};

export const CLUSTER_SIGNATURE_VERSION = 'cluster-signature-v1' as const;

export const GATE_ORDER = [
  'essential_function',
  'technical_dependencies',
  'hard_budget',
  'data_privacy',
  'coverage',
  'curation_evidence',
] as const;
