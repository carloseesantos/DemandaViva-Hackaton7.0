/**
 * Dicionário de rótulos — NÃO define enums paralelos ao DATA_MODEL v1.0.0.
 * As chaves são validadas em compilação contra os tipos oficiais do AG-01.
 */
import type {
  PainCode, RequirementCode, SegmentCode, SizeCode, ChannelCode,
  ErpCode, CurationStatus, GateCode, ScoreCriterion, BudgetBand,
  DataSharing, AssociationCode,
} from '../domain/types';

export const PAIN_LABELS: Record<PainCode, string> = {
  stock_confirmation_delay: 'Demora na confirmação de estoque',
  sales_reconciliation: 'Dificuldade na conciliação de vendas',
  customer_follow_up: 'Acompanhamento de clientes',
};
export const REQUIREMENT_LABELS: Record<RequirementCode, string> = {
  stock_lookup: 'Consultar disponibilidade de estoque',
  whatsapp_workflow: 'Apoiar fluxo de pedidos/contatos por WhatsApp',
  multi_store: 'Consultar mais de uma unidade',
  no_erp_dependency: 'Funcionar sem dependência obrigatória de ERP',
  mobile_access: 'Permitir uso em dispositivo móvel',
  manual_stock_update: 'Permitir atualização manual de estoque',
  privacy_preserving: 'Preservar limite de compartilhamento de dados',
  short_training: 'Permitir treinamento curto',
};
export const SEGMENT_LABELS: Record<SegmentCode, string> = {
  stationery: 'Papelaria', fashion: 'Moda', housewares: 'Utilidades',
  gifts: 'Presentes', grocery: 'Mercearia', other: 'Outros',
};
export const SIZE_LABELS: Record<SizeCode, string> = {micro: 'Micro', small: 'Pequeno'};
export const CHANNEL_LABELS: Record<ChannelCode, string> = {
  whatsapp: 'WhatsApp', counter: 'Balcão', ecommerce: 'E-commerce', mixed: 'Misto',
};
export const ERP_LABELS: Record<ErpCode, string> = {erp_x: 'ERP X (fictício)'};
export const ASSOCIATION_LABELS: Record<AssociationCode, string> = {
  ac_alfa: 'AC Alfa (fictícia)', ac_beta: 'AC Beta (fictícia)',
};
export const CURATION_LABELS: Record<CurationStatus, string> = {
  received: 'Cadastro recebido (simulação)',
  under_review: 'Em verificação (simulação)',
  validated_for_demo: 'Validada apenas para a DEMONSTRAÇÃO',
  suspended: 'Suspensa (simulação)',
  expired: 'Ficha expirada (simulação)',
};
export const GATE_LABELS: Record<GateCode, string> = {
  essential_function: 'Função essencial',
  technical_dependencies: 'Dependências técnicas e requisitos obrigatórios',
  hard_budget: 'Teto rígido mensal',
  data_privacy: 'Compartilhamento e privacidade',
  coverage: 'Cobertura, porte, segmento e canal',
  curation_evidence: 'Curadoria e vigência de evidências simuladas',
};
export const SCORE_LABELS: Record<ScoreCriterion, string> = {
  functional: 'Aderência funcional', technical: 'Compatibilidade técnica',
  economic: 'Viabilidade econômica', operation: 'Implantação e operação',
  evidence: 'Maturidade e evidências SIMULADAS',
};
export const BUDGET_CAP_CENTS: Record<BudgetBand, number> = {
  low: 20000, medium: 50000, high: 100000,
};
export const BUDGET_LABELS: Record<BudgetBand, string> = {
  low: 'Até R$ 200/mês (teto fictício)',
  medium: 'Até R$ 500/mês (teto fictício)',
  high: 'Até R$ 1.000/mês (teto fictício)',
};
export const DATA_SHARING_LABELS: Record<DataSharing, string> = {
  none: 'Não pode compartilhar', restricted: 'Compartilhamento restrito',
  allowed: 'Compartilhamento permitido na simulação',
};
export const DEMO_REGION_CODE = 'regional_demo' as const;
export const CATALOG_DISCLOSURE = 'CATÁLOGO 100% FICTÍCIO · PREÇOS, PILOTOS E VALIDAÇÕES SIMULADOS' as const;
