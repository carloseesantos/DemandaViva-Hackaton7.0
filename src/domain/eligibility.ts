/**
 * Seis gates eliminatórios — sempre antes de qualquer score.
 * unknown ⇒ needs_information / insufficient_data; nunca inventar custo ou evidência.
 */
import type {
  CatalogEvidence,
  GateCode,
  GateResult,
  QualifiedNeed,
  Solution,
} from './types';
import {
  DATA_SHARING_RANK,
  DEMO_COVERAGE_REGION,
  ESSENTIAL_FUNCTION_CODES,
  GATE_ORDER,
  MATCH_BUDGET_CAP_CENTS,
} from './matchRules';

/** Fatos operacionais fora do contrato Solution (AG-05 display), injetados pelo serviço. */
export type SolutionOperationalFacts = {
  trainingHours: number | null;
  mobileSupported: boolean;
  offlineSupported: boolean;
};

export type EligibilityOutcome =
  | { outcome: 'ineligible'; gates: GateResult[]; failedGateCodes: GateCode[] }
  | { outcome: 'needs_information'; gates: GateResult[]; missingInformation: string[] }
  | { outcome: 'eligible'; gates: GateResult[]; validEvidenceIds: string[] };

function gate(code: GateCode, status: GateResult['status'], reason: string, evidenceIds: string[] = []): GateResult {
  return { code, status, reason, evidenceIds };
}

function parseIso(value: string): number {
  return Date.parse(value);
}

export function selectValidEvidence(
  solution: Solution,
  evidence: readonly CatalogEvidence[],
  evaluatedAt: string,
): CatalogEvidence[] {
  return evidence.filter(
    (e) =>
      solution.evidenceIds.includes(e.id) &&
      e.solutionId === solution.id &&
      e.sourceMode === 'synthetic' &&
      e.reviewStatus === 'valid_for_demo' &&
      parseIso(e.checkedAt) <= parseIso(evaluatedAt) &&
      parseIso(e.expiresAt) >= parseIso(evaluatedAt),
  );
}

/**
 * Avalia os seis gates na ordem fixa GATE_ORDER.
 * fail tem precedência sobre unknown; score só é permitido após seis pass.
 */
export function evaluateEligibility(
  need: QualifiedNeed,
  solution: Solution,
  evaluatedAt: string,
  evidence: readonly CatalogEvidence[],
  facts: SolutionOperationalFacts,
): EligibilityOutcome {
  const goodEvidence = selectValidEvidence(solution, evidence, evaluatedAt);
  const ev = goodEvidence.map((x) => x.id);
  const mandatory = need.requirements.filter((r) => r.kind === 'mandatory').map((r) => r.code);

  const missingFunctions = mandatory.filter(
    (code) => ESSENTIAL_FUNCTION_CODES.has(code) && !solution.coveredRequirements.includes(code),
  );
  const handlesPain = solution.essentialPainCodes.includes(need.painCode);
  const gEssential = gate(
    'essential_function',
    handlesPain && missingFunctions.length === 0 ? 'pass' : 'fail',
    !handlesPain
      ? `Solução não atende à dor ${need.painCode}`
      : missingFunctions.length > 0
        ? `Função obrigatória ausente: ${missingFunctions.join(', ')}`
        : 'Função essencial declarada na simulação',
    ev,
  );

  const missingSystems = solution.requiredSystems.filter(
    (code) => !(need.hasErp && need.erpCode === code),
  );
  const requiresNoErp = mandatory.includes('no_erp_dependency');
  const technicalProblems: string[] = [];
  const technicalUnknown: string[] = [];
  if (missingSystems.length > 0) {
    technicalProblems.push(`Exige ${missingSystems.join(', ')} indisponível`);
  }
  if (requiresNoErp && solution.requiredSystems.length > 0) {
    technicalProblems.push('Requisito obrigatório de operar sem ERP não atendido');
  }
  if (facts.trainingHours === null) {
    technicalUnknown.push('Horas de treinamento não confirmadas');
  } else if (facts.trainingHours > need.constraints.trainingMaxHours) {
    technicalProblems.push(
      `Treinamento ${facts.trainingHours}h ultrapassa teto ${need.constraints.trainingMaxHours}h`,
    );
  }
  if (mandatory.includes('short_training') && !solution.coveredRequirements.includes('short_training')) {
    technicalProblems.push('Treinamento curto obrigatório não coberto');
  }
  if (need.constraints.offlineRequired && !facts.offlineSupported) {
    technicalProblems.push('Operação offline não suportada');
  }
  const gTechnical = gate(
    'technical_dependencies',
    technicalProblems.length > 0 ? 'fail' : technicalUnknown.length > 0 ? 'unknown' : 'pass',
    [...technicalProblems, ...technicalUnknown].join('; ') ||
      'Dependências técnicas e treinamento compatíveis',
    ev,
  );

  const cost = solution.minimumMonthlyCostCents;
  const cap = MATCH_BUDGET_CAP_CENTS[need.constraints.budgetBand];
  const gBudget = gate(
    'hard_budget',
    cost === null ? 'unknown' : cost > cap ? 'fail' : 'pass',
    cost === null
      ? 'Preço mínimo desconhecido, solicitar cotação antes de recomendar'
      : cost > cap
        ? `Mínimo sintético R$ ${(cost / 100).toFixed(2)} acima do teto sintético R$ ${(cap / 100).toFixed(2)}`
        : 'Custo mínimo mensal sintético dentro do teto informado',
  );

  const hasPrivacyRequirement = mandatory.includes('privacy_preserving');
  const privacyOk =
    DATA_SHARING_RANK[solution.dataSharingRequired] <= DATA_SHARING_RANK[need.constraints.dataSharing] &&
    (!hasPrivacyRequirement || solution.coveredRequirements.includes('privacy_preserving'));
  const gPrivacy = gate(
    'data_privacy',
    privacyOk ? 'pass' : 'fail',
    privacyOk
      ? 'Condições de compartilhamento sintéticas compatíveis'
      : 'Restrição obrigatória de dados não atendida',
  );

  const coverageOk =
    solution.supportedSegments.includes(need.segmentCode) &&
    solution.supportedSizes.includes(need.sizeCode) &&
    solution.supportedChannels.includes(need.channelCode) &&
    solution.coverageRegionCodes.includes(DEMO_COVERAGE_REGION) &&
    (!need.constraints.mobileRequired || facts.mobileSupported) &&
    (!mandatory.includes('mobile_access') || facts.mobileSupported);
  const gCoverage = gate(
    'coverage',
    coverageOk ? 'pass' : 'fail',
    coverageOk
      ? 'Segmento, porte, canal, região e mobilidade atendidos na simulação'
      : 'Falha de território, porte, segmento, canal ou mobilidade indispensável',
  );

  let curStatus: GateResult['status'];
  let curReason: string;
  if (
    solution.curationStatus === 'expired' ||
    solution.curationStatus === 'suspended' ||
    parseIso(solution.validUntil) < parseIso(evaluatedAt)
  ) {
    curStatus = 'fail';
    curReason = 'Ficha suspensa ou expirada: proibido recomendar';
  } else if (solution.curationStatus !== 'validated_for_demo') {
    curStatus = 'unknown';
    curReason = 'Validação demonstrativa ainda em curadoria';
  } else if (goodEvidence.length === 0) {
    curStatus = 'unknown';
    curReason = 'Evidência simulada vigente insuficiente';
  } else {
    curStatus = 'pass';
    curReason = 'Validação SOMENTE SIMULADA vigente, sem evidência real';
  }
  const gCuration = gate('curation_evidence', curStatus, curReason, ev);

  const byCode = new Map<GateCode, GateResult>([
    [gEssential.code, gEssential],
    [gTechnical.code, gTechnical],
    [gBudget.code, gBudget],
    [gPrivacy.code, gPrivacy],
    [gCoverage.code, gCoverage],
    [gCuration.code, gCuration],
  ]);
  const gates = GATE_ORDER.map((code) => byCode.get(code)!);

  const failures = gates.filter((g) => g.status === 'fail').map((g) => g.code);
  if (failures.length > 0) {
    return { outcome: 'ineligible', gates, failedGateCodes: failures };
  }

  const unknowns = gates.filter((g) => g.status === 'unknown').map((g) => `${g.code}: ${g.reason}`);
  const missing: string[] = [...unknowns];
  if (solution.implantationHours === null) {
    missing.push('Horas de implantação não confirmadas');
  }
  if (missing.length > 0) {
    return { outcome: 'needs_information', gates, missingInformation: missing };
  }

  return { outcome: 'eligible', gates, validEvidenceIds: ev };
}
