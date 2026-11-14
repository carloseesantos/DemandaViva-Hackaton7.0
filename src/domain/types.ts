// Contrato canônico G1 — docs/DATA_MODEL.md v1.0.0 §4 (AG-01, aprovado em DEC-APP-G1-20261114).
// Qualquer alteração de campo, enum ou semântica é breaking: exige proposta ao PMO e schemaVersion 2.

export const SCHEMA_VERSION = 1 as const;
export const MATCH_RULES_VERSION = 'match-v1' as const;
export const CATALOG_VERSION = 'catalog-v1' as const;
export type UUID = string & { readonly __uuid: unique symbol };
export type ISODateTime = string & { readonly __isoDateTime: unique symbol };

export type AssociationCode = 'ac_alfa' | 'ac_beta';
export type SegmentCode = 'stationery' | 'fashion' | 'housewares' | 'gifts' | 'grocery' | 'other';
export type SizeCode = 'micro' | 'small';
export type ChannelCode = 'whatsapp' | 'counter' | 'ecommerce' | 'mixed';
export type PainCode = 'stock_confirmation_delay' | 'sales_reconciliation' | 'customer_follow_up';
export type ProcessCode = 'visual_check' | 'spreadsheet_check' | 'manual_message' | 'erp_lookup' | 'other';
export type FrequencyCode = 'daily' | 'weekly' | 'monthly';
export type ErpCode = 'erp_x';
export type RequirementCode =
  | 'stock_lookup'
  | 'whatsapp_workflow'
  | 'multi_store'
  | 'no_erp_dependency'
  | 'mobile_access'
  | 'manual_stock_update'
  | 'privacy_preserving'
  | 'short_training';
export type MetricCode = 'confirmation_minutes' | 'hours_per_week' | 'error_rate_pct';
export type BudgetBand = 'low' | 'medium' | 'high';
export type DataSharing = 'none' | 'restricted' | 'allowed';
export type NeedOrigin = 'seed' | 'scenario_fixture' | 'remote';
export type GateCode =
  | 'essential_function'
  | 'technical_dependencies'
  | 'hard_budget'
  | 'data_privacy'
  | 'coverage'
  | 'curation_evidence';
export type ScoreCriterion = 'functional' | 'technical' | 'economic' | 'operation' | 'evidence';
export type CurationStatus = 'received' | 'under_review' | 'validated_for_demo' | 'suspended' | 'expired';

export interface Association {
  code: AssociationCode;
  displayName: string;
  regionalCode: 'regional_demo';
  isDemo: true;
}
export interface Requirement {
  id: string;
  code: RequirementCode;
  kind: 'mandatory' | 'optional';
  priority: 1 | 2 | 3;
  description: string;
  acceptanceCriterion: string;
  evidence: 'simulated' | 'declared' | 'missing';
}
export interface NeedConstraints {
  budgetBand: BudgetBand;
  dataSharing: DataSharing;
  mobileRequired: boolean;
  offlineRequired: boolean;
  trainingMaxHours: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
}
export interface SuccessMetric {
  code: MetricCode;
  baseline: number;
  target: number;
}
export interface QualifiedNeed {
  id: UUID;
  schemaVersion: typeof SCHEMA_VERSION;
  origin: NeedOrigin;
  createdAt: ISODateTime;
  status: 'qualified';
  isDemo: true;
  associationCode: AssociationCode;
  segmentCode: SegmentCode;
  sizeCode: SizeCode;
  channelCode: ChannelCode;
  painCode: PainCode;
  processCode: ProcessCode;
  frequencyCode: FrequencyCode;
  hasErp: boolean;
  erpCode: ErpCode | null;
  problemSummary: string;
  requirements: Requirement[];
  constraints: NeedConstraints;
  metric: SuccessMetric;
  demoClusterKey: string;
}
export interface NeedDraft {
  id: UUID;
  schemaVersion: typeof SCHEMA_VERSION;
  status: 'draft' | 'insufficient_data';
  localOnly: true;
  isDemo: true;
  fields: Partial<
    Pick<
      QualifiedNeed,
      | 'associationCode'
      | 'segmentCode'
      | 'sizeCode'
      | 'channelCode'
      | 'painCode'
      | 'processCode'
      | 'frequencyCode'
      | 'hasErp'
      | 'erpCode'
      | 'problemSummary'
      | 'requirements'
      | 'constraints'
      | 'metric'
    >
  >;
  missingFields: string[];
}
export type Need = QualifiedNeed | NeedDraft;
export type NewQualifiedNeed = Omit<QualifiedNeed, 'createdAt' | 'origin' | 'demoClusterKey'> & { origin: 'remote' };

export interface Startup {
  id: string;
  displayName: string;
  summary: string;
  solutionIds: string[];
  isDemo: true;
}
export interface CatalogEvidence {
  id: string;
  solutionId: string;
  kind: 'demo' | 'documentation' | 'pilot' | 'reference';
  statement: string;
  sourceMode: 'synthetic';
  checkedAt: ISODateTime;
  expiresAt: ISODateTime;
  reviewStatus: 'valid_for_demo' | 'expired' | 'pending';
}
export interface Solution {
  id: string;
  startupId: string;
  name: string;
  description: string;
  essentialPainCodes: PainCode[];
  coveredRequirements: RequirementCode[];
  requiredSystems: ErpCode[];
  supportedChannels: ChannelCode[];
  supportedSegments: SegmentCode[];
  supportedSizes: SizeCode[];
  coverageRegionCodes: string[];
  minimumMonthlyCostCents: number | null;
  dataSharingRequired: DataSharing;
  implantationHours: number | null;
  curationStatus: CurationStatus;
  evidenceIds: string[];
  lastCheckedAt: ISODateTime;
  validUntil: ISODateTime;
  catalogVersion: string;
  isDemo: true;
}
export type GateResult = {
  code: GateCode;
  status: 'pass' | 'fail' | 'unknown';
  reason: string;
  evidenceIds: string[];
};
export type ScoreComponent = {
  criterion: ScoreCriterion;
  weight: 30 | 20 | 15;
  rating: 0 | 1 | 2 | 3 | 4 | 5;
  points: number;
};
interface MatchBase {
  needId: UUID;
  solutionId: string;
  evaluatedAt: ISODateTime;
  rulesVersion: typeof MATCH_RULES_VERSION;
  catalogVersion: string;
  gates: GateResult[];
  explanations: string[];
  limitations: string[];
}
export type MatchResult =
  | (MatchBase & {
      outcome: 'ineligible';
      failedGateCodes: GateCode[];
      score?: never;
      breakdown?: never;
      recommendation?: never;
    })
  | (MatchBase & {
      outcome: 'needs_information';
      missingInformation: string[];
      score?: never;
      breakdown?: never;
      recommendation?: never;
    })
  | (MatchBase & {
      outcome: 'eligible';
      score: number;
      breakdown: ScoreComponent[];
      recommendation: 'recommended' | 'conditional' | 'not_recommended';
      failedGateCodes?: never;
    });
export type MatchEvaluation =
  | { status: 'insufficient_data'; needId: UUID; missingInformation: string[]; results: MatchResult[] }
  | {
      status: 'no_eligible_catalog_solution' | 'no_recommendation' | 'conditional' | 'recommended';
      needId: UUID;
      results: MatchResult[];
      topSolutionId?: string;
    };

export interface DemoReview {
  mode: 'simulated';
  status: 'draft' | 'suggested' | 'reviewed_simulated';
  note?: string; // nunca assinar como decisão de pessoa real
}
export interface Brief {
  id: string;
  needId: UUID;
  version: number;
  generatedAt: ISODateTime;
  problem: string;
  currentProcess: string;
  expectedOutcome: string;
  mandatory: RequirementCode[];
  optional: RequirementCode[];
  constraints: NeedConstraints;
  metric: SuccessMetric;
  catalogGaps: Array<{ solutionId: string; gateCodes: GateCode[] }>;
  openQuestions: string[];
  shareAuthorization: 'not_requested' | 'simulated_authorized';
  review: DemoReview;
}
export interface DemandCluster {
  id: string;
  signature: string;
  needIds: UUID[];
  associationCodes: AssociationCode[];
  painCode: PainCode;
  processFamily: 'manual' | 'digital';
  erpContext: 'erp' | 'no_erp';
  channelCode: ChannelCode;
  metricCode: MetricCode;
  variations: string[];
  blockingConflicts: string[];
  distinctRecordCount: number;
  review: DemoReview;
}
export interface InnovationCall {
  id: string;
  clusterId: string;
  version: number;
  title: string;
  needIds: UUID[];
  acceptanceRequirements: RequirementCode[];
  recurrenceEvidence: { records: number; associations: number; period: string };
  mode: 'draft_demo' | 'opened_simulated';
  review: DemoReview;
  sharing: 'simulated';
}
export type ResponseType =
  | 'clarification'
  | 'existing_solution'
  | 'adaptation'
  | 'co_development'
  | 'pilot'
  | 'decline';
export interface StartupResponse {
  id: string;
  callId: string;
  startupId: string;
  responseType: ResponseType;
  coveredRequirements: RequirementCode[];
  questions: string[];
  dependencies: string[];
  risks: string[];
  estimateCents: number | null;
  estimateDays: number | null;
  demoOnly: true;
}

export interface DemandRepository {
  save(need: NewQualifiedNeed): Promise<QualifiedNeed>;
  list(): Promise<QualifiedNeed[]>;
  get(id: UUID): Promise<QualifiedNeed | null>;
}
export type PersistenceState =
  | { state: 'local_draft' }
  | { state: 'saving' }
  | { state: 'synced'; id: UUID; savedAt: ISODateTime }
  | { state: 'sync_failed'; id: UUID; reason: string; retryAllowed: true };
