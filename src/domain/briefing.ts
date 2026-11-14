/**
 * Briefing em ausência de match elegível no catálogo consultado.
 * Diagnóstico incompleto NÃO gera briefing definitivo.
 */
import type {
  Brief,
  GateCode,
  ISODateTime,
  MatchEvaluation,
  Need,
  NeedDraft,
  QualifiedNeed,
  RequirementCode,
} from './types';
import { PROCESS_FAMILY } from './matchRules';

const PROCESS_LABEL: Record<QualifiedNeed['processCode'], string> = {
  visual_check: 'conferência visual',
  spreadsheet_check: 'consulta em planilha',
  manual_message: 'mensagens manuais entre a equipe',
  erp_lookup: 'consulta ao ERP',
  other: 'outro processo operacional',
};

export type BriefingOutcome =
  | { kind: 'brief'; brief: Brief }
  | { kind: 'insufficient_data'; missingInformation: string[]; reason: string };

function openQuestionsFor(need: QualifiedNeed): string[] {
  const questions = [
    'Qual volume aproximado de SKUs precisa ser consultado neste cenário fictício?',
    'Com que frequência o estoque seria atualizado sem integração automática?',
    'Há conectividade estável nas unidades durante o atendimento?',
  ];
  if (!need.hasErp) {
    questions.push('Existe disposição para adotar ERP ou a operação deve permanecer sem ERP?');
  }
  if (need.constraints.mobileRequired) {
    questions.push('O atendimento móvel ocorre em qual dispositivo e contexto operacional?');
  }
  return questions;
}

/**
 * Gera minuta de briefing somente para necessidade qualificada sem solução elegível.
 * Cenário C / incomplete → insufficient_data (não confundir com não-match).
 */
export function generateBriefing(
  need: Need,
  evaluation: MatchEvaluation,
  generatedAt: ISODateTime,
): BriefingOutcome {
  if (need.status !== 'qualified') {
    const draft = need as NeedDraft;
    return {
      kind: 'insufficient_data',
      missingInformation: draft.missingFields,
      reason:
        'Diagnóstico incompleto: não há briefing definitivo até complementar os campos obrigatórios.',
    };
  }

  if (evaluation.status === 'insufficient_data') {
    return {
      kind: 'insufficient_data',
      missingInformation: evaluation.missingInformation,
      reason: 'Há informação crítica pendente; briefing definitivo não é emitido.',
    };
  }

  if (evaluation.status !== 'no_eligible_catalog_solution') {
    return {
      kind: 'insufficient_data',
      missingInformation: [
        `Estado da avaliação é '${evaluation.status}'; briefing de lacuna aplica-se ao caminho B.`,
      ],
      reason: 'Briefing de ausência de match só se aplica quando não há solução elegível no catálogo consultado.',
    };
  }

  const catalogGaps = evaluation.results
    .filter((r) => r.outcome === 'ineligible')
    .map((r) => ({
      solutionId: r.solutionId,
      gateCodes: r.failedGateCodes as GateCode[],
    }))
    .sort((a, b) => a.solutionId.localeCompare(b.solutionId));

  const mandatory = need.requirements
    .filter((r) => r.kind === 'mandatory')
    .map((r) => r.code as RequirementCode)
    .sort();
  const optional = need.requirements
    .filter((r) => r.kind === 'optional')
    .map((r) => r.code as RequirementCode)
    .sort();

  const brief: Brief = {
    id: `brief:${need.id}:v1`,
    needId: need.id,
    version: 1,
    generatedAt,
    problem: need.problemSummary,
    currentProcess: `Processo atual (${PROCESS_FAMILY[need.processCode]}): ${PROCESS_LABEL[need.processCode]}.`,
    expectedOutcome: `Melhorar ${need.metric.code} de ${need.metric.baseline} para ${need.metric.target} (valores fictícios do cenário).`,
    mandatory,
    optional,
    constraints: need.constraints,
    metric: need.metric,
    catalogGaps,
    openQuestions: openQuestionsFor(need),
    shareAuthorization: 'not_requested',
    review: { mode: 'simulated', status: 'draft' },
  };

  return { kind: 'brief', brief };
}
