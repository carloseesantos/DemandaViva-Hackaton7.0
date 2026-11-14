/**
 * TEMPORÁRIO AG-09 — stand-in tipado até `buildBrief` canônico do AG-07.
 * Contrato: `buildBrief(need, evaluation) → Brief`.
 */
import type { Brief, GateCode, MatchEvaluation, QualifiedNeed, RequirementCode } from '../domain/types';
import { PROCESS_FAMILY } from '../data/registries';

const PROCESS_LABEL: Record<QualifiedNeed['processCode'], string> = {
  visual_check: 'conferência visual',
  spreadsheet_check: 'consulta em planilha',
  manual_message: 'mensagens manuais entre a equipe',
  erp_lookup: 'consulta ao ERP',
  other: 'outro processo operacional',
};

export function buildBrief(need: QualifiedNeed, evaluation: MatchEvaluation): Brief {
  const catalogGaps = evaluation.results
    .filter((r) => r.outcome === 'ineligible')
    .map((r) => ({
      solutionId: r.solutionId,
      gateCodes: r.failedGateCodes as GateCode[],
    }));

  const mandatory = need.requirements
    .filter((r) => r.kind === 'mandatory')
    .map((r) => r.code as RequirementCode);
  const optional = need.requirements
    .filter((r) => r.kind === 'optional')
    .map((r) => r.code as RequirementCode);

  const openQuestions = [
    'Qual volume aproximado de SKUs precisa ser consultado neste cenário fictício?',
    'Com que frequência o estoque seria atualizado sem ERP?',
    'Há conectividade estável nas unidades durante o atendimento?',
  ];

  return {
    id: `brief:${need.id}:v1`,
    needId: need.id,
    version: 1,
    generatedAt: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z') as Brief['generatedAt'],
    problem: need.problemSummary,
    currentProcess: `Processo atual (${PROCESS_FAMILY[need.processCode]}): ${PROCESS_LABEL[need.processCode]}.`,
    expectedOutcome: `Melhorar ${need.metric.code} de ${need.metric.baseline} para ${need.metric.target} (valores fictícios do cenário).`,
    mandatory,
    optional,
    constraints: need.constraints,
    metric: need.metric,
    catalogGaps,
    openQuestions,
    shareAuthorization: 'not_requested',
    review: { mode: 'simulated', status: 'draft' },
  };
}
