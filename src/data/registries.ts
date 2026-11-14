/** AG-06 — dados exclusivamente sintéticos. Dicionários do contrato AG-01 v1.0.0.
 * Nunca persistir texto livre nem usar estes exemplos como registros de lojistas reais.
 */
import type {
  PainCode, RequirementCode, MetricCode, ProcessCode, Requirement, UUID,
} from '../domain/types';
export { BUDGET_CAP_CENTS } from './catalog-enums';

export const PAIN_TEMPLATES: Readonly<Record<PainCode, string>> = {
  stock_confirmation_delay: 'A confirmação manual de estoque atrasa respostas a pedidos.',
  sales_reconciliation: 'A conferência manual de vendas aumenta o tempo de fechamento.',
  customer_follow_up: 'O acompanhamento manual de clientes atrasa o retorno de contatos.',
};

export const PROCESS_FAMILY: Readonly<Record<ProcessCode, 'manual' | 'digital'>> = {
  visual_check: 'manual', spreadsheet_check: 'manual', manual_message: 'manual',
  erp_lookup: 'digital', other: 'digital',
};

export const METRIC_REGISTRY: Readonly<Record<MetricCode, { label: string; unit: string }>> = {
  confirmation_minutes: {label:'Tempo de confirmação de estoque',unit:'minutos'},
  hours_per_week: {label:'Tempo gasto na semana',unit:'horas/semana'},
  error_rate_pct: {label:'Taxa de erros',unit:'%'},
};

type RequirementTemplate = Pick<Requirement, 'description' | 'acceptanceCriterion' | 'priority'>;
export const REQUIREMENT_REGISTRY: Readonly<Record<RequirementCode, RequirementTemplate>> = {
  stock_lookup: {
    description:'Consultar a disponibilidade de itens em estoque',
    acceptanceCriterion:'Consultar um SKU e obter indicação de disponibilidade da unidade selecionada', priority:1,
  },
  whatsapp_workflow: {
    description:'Apoiar o atendimento de pedidos recebidos por WhatsApp',
    acceptanceCriterion:'Permitir consultar estoque durante a resposta a uma solicitação recebida por WhatsApp', priority:1,
  },
  multi_store: {
    description:'Consultar disponibilidade por unidade',
    acceptanceCriterion:'Distinguir o estoque de duas unidades sem misturar os saldos', priority:1,
  },
  no_erp_dependency: {
    description:'Operar sem ERP integrado',
    acceptanceCriterion:'Executar a consulta sem exigir ERP X nem outro ERP prévio', priority:1,
  },
  mobile_access: {
    description:'Permitir consulta pelo celular',
    acceptanceCriterion:'Consultar estoque por dispositivo móvel no fluxo de atendimento', priority:2,
  },
  manual_stock_update: {
    description:'Permitir atualização manual da disponibilidade',
    acceptanceCriterion:'Permitir atualizar disponibilidade de SKU sem integração obrigatória a ERP', priority:2,
  },
  privacy_preserving: {
    description:'Respeitar limites de compartilhamento de dados',
    acceptanceCriterion:'Operar dentro do limite de compartilhamento informado pelo estabelecimento', priority:2,
  },
  short_training: {
    description:'Permitir aprendizado operacional rápido',
    acceptanceCriterion:'Concluir orientação inicial sem exceder as horas máximas declaradas', priority:2,
  },
};

/** IDs de Requirement são projeções em memória, não colunas adicionais no Supabase. */
export function makeDemoRequirement(
  needId: UUID, code: RequirementCode, kind: Requirement['kind'],
  priority: Requirement['priority'] = REQUIREMENT_REGISTRY[code].priority,
): Requirement {
  const entry = REQUIREMENT_REGISTRY[code];
  return {id:`req:${needId}:${code}`, code, kind, priority,
    description:entry.description, acceptanceCriterion:entry.acceptanceCriterion,
    evidence:'simulated'};
}

export function deriveDemoClusterKey(
  painCode:PainCode, processCode:ProcessCode, hasErp:boolean,
  channelCode:'whatsapp'|'counter'|'ecommerce'|'mixed',
): string {
  return `${painCode}|${PROCESS_FAMILY[processCode]}|${hasErp?'erp':'no_erp'}|${channelCode}`;
}
