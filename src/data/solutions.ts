/**
 * AG-05 / catálogo-v1 — TODOS OS PRODUTOS, FORNECEDORES, PREÇOS E TESTES SÃO FICTÍCIOS.
 * Exportações canônicas `solutions` e `catalogEvidence` usam exatamente os tipos AG-01.
 * Os metadados de exibição NÃO criam novos enums de domínio nem afetam gates sem explicitação.
 * Nunca consultar Supabase para startups/soluções/evidências do MVP P0.
 */
import { CATALOG_VERSION } from '../domain/types';
import type { CatalogEvidence, Solution, ISODateTime } from '../domain/types';

const asISO = (value: string): ISODateTime => {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value) || !Number.isFinite(Date.parse(value))) {
    throw new Error(`Data UTC inválida: ${value}`);
  }
  return value as ISODateTime;
};

export const solutions: Solution[] = [
  {
    id: 'solution:estoqueponte-v1', startupId: 'startup:pontelab', name: 'EstoquePonte',
    description: 'Consulta sintética de disponibilidade de estoque entre unidades com integração OBRIGATÓRIA ao ERP X fictício. Não opera apenas com planilha.',
    essentialPainCodes: ['stock_confirmation_delay'],
    coveredRequirements: ['stock_lookup', 'whatsapp_workflow', 'multi_store', 'mobile_access', 'privacy_preserving', 'short_training'],
    requiredSystems: ['erp_x'],
    supportedChannels: ['whatsapp', 'counter', 'mixed'],
    supportedSegments: ['stationery', 'fashion', 'housewares', 'gifts', 'grocery'],
    supportedSizes: ['micro', 'small'], coverageRegionCodes: ['regional_demo'],
    minimumMonthlyCostCents: 19900,
    dataSharingRequired: 'restricted', implantationHours: 8,
    curationStatus: 'validated_for_demo',
    evidenceIds: ['ev:estoqueponte:demo', 'ev:estoqueponte:documentation', 'ev:estoqueponte:pilot'],
    lastCheckedAt: asISO('2026-11-10T12:00:00Z'), validUntil: asISO('2027-02-28T23:59:59Z'),
    catalogVersion: CATALOG_VERSION, isDemo: true,
  },
  {
    id: 'solution:caixaclara-v1', startupId: 'startup:ritmodados', name: 'CaixaClara',
    description: 'Conferência fictícia de totais de vendas e registros de caixa; NÃO consulta estoque ou disponibilidade por WhatsApp.',
    essentialPainCodes: ['sales_reconciliation'],
    coveredRequirements: ['privacy_preserving', 'short_training', 'mobile_access'],
    requiredSystems: [], supportedChannels: ['counter', 'mixed'],
    supportedSegments: ['stationery', 'fashion', 'housewares', 'gifts', 'grocery', 'other'],
    supportedSizes: ['micro', 'small'], coverageRegionCodes: ['regional_demo'],
    minimumMonthlyCostCents: 8900, dataSharingRequired: 'none', implantationHours: 4,
    curationStatus: 'validated_for_demo',
    evidenceIds: ['ev:caixaclara:demo', 'ev:caixaclara:documentation'],
    lastCheckedAt: asISO('2026-11-08T12:00:00Z'), validUntil: asISO('2027-01-31T23:59:59Z'),
    catalogVersion: CATALOG_VERSION, isDemo: true,
  },
  {
    id: 'solution:vitrineretorno-v1', startupId: 'startup:relavarejo', name: 'VitrineRetorno',
    description: 'Fluxo fictício de acompanhamento de clientes por mensagens com limitações de treinamento e automação. NÃO faz consulta de estoque.',
    essentialPainCodes: ['customer_follow_up'],
    coveredRequirements: ['whatsapp_workflow', 'privacy_preserving', 'mobile_access'],
    requiredSystems: [], supportedChannels: ['whatsapp', 'mixed'],
    supportedSegments: ['fashion', 'gifts', 'stationery', 'other'],
    supportedSizes: ['micro', 'small'], coverageRegionCodes: ['regional_demo'],
    minimumMonthlyCostCents: 18000, dataSharingRequired: 'restricted', implantationHours: 14,
    curationStatus: 'validated_for_demo',
    evidenceIds: ['ev:vitrineretorno:demo', 'ev:vitrineretorno:documentation'],
    lastCheckedAt: asISO('2026-11-09T12:00:00Z'), validUntil: asISO('2027-01-15T23:59:59Z'),
    catalogVersion: CATALOG_VERSION, isDemo: true,
  },
  {
    id: 'solution:fechorapido-v1', startupId: 'startup:pontoapoio', name: 'FechoRápido',
    description: 'Protótipo fictício de conferência de recebimentos em análise de curadoria, sem preço mínimo confirmado sequer na simulação.',
    essentialPainCodes: ['sales_reconciliation'],
    coveredRequirements: ['privacy_preserving', 'short_training'],
    requiredSystems: [], supportedChannels: ['counter', 'mixed'],
    supportedSegments: ['stationery', 'fashion', 'housewares', 'gifts', 'grocery'],
    supportedSizes: ['micro', 'small'], coverageRegionCodes: ['regional_demo'],
    minimumMonthlyCostCents: null, dataSharingRequired: 'restricted', implantationHours: null,
    curationStatus: 'under_review', evidenceIds: ['ev:fechorapido:documentation'],
    lastCheckedAt: asISO('2026-11-11T12:00:00Z'), validUntil: asISO('2027-01-31T23:59:59Z'),
    catalogVersion: CATALOG_VERSION, isDemo: true,
  },
  {
    id: 'solution:visordelegado-v1', startupId: 'startup:pontelab', name: 'VisorDeLegado',
    description: 'Consulta fictícia de saldos dependente de ERP X; ficha EXPIRADA propositalmente para testar o bloqueio da curadoria.',
    essentialPainCodes: ['stock_confirmation_delay'],
    coveredRequirements: ['stock_lookup', 'multi_store', 'mobile_access', 'privacy_preserving'],
    requiredSystems: ['erp_x'], supportedChannels: ['whatsapp', 'counter', 'mixed'],
    supportedSegments: ['stationery', 'fashion', 'housewares', 'gifts'],
    supportedSizes: ['micro', 'small'], coverageRegionCodes: ['regional_demo'],
    minimumMonthlyCostCents: 14900, dataSharingRequired: 'restricted', implantationHours: 6,
    curationStatus: 'expired', evidenceIds: ['ev:visordelegado:pilot'],
    lastCheckedAt: asISO('2026-08-15T12:00:00Z'), validUntil: asISO('2026-10-01T23:59:59Z'),
    catalogVersion: CATALOG_VERSION, isDemo: true,
  },
];

export const catalogEvidence: CatalogEvidence[] = [
  {id:'ev:estoqueponte:demo', solutionId:'solution:estoqueponte-v1', kind:'demo',
   statement:'Demonstração funcional INVENTADA de leitura entre duas lojas com ERP X fictício; não foi executada no mundo real.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-10T12:00:00Z'), expiresAt:asISO('2027-02-28T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:estoqueponte:documentation', solutionId:'solution:estoqueponte-v1', kind:'documentation',
   statement:'Manual técnico FICTÍCIO registra dependência OBRIGATÓRIA de ERP X, operação móvel e implantação estimada.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-10T12:00:00Z'), expiresAt:asISO('2027-02-28T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:estoqueponte:pilot', solutionId:'solution:estoqueponte-v1', kind:'pilot',
   statement:'Relato de piloto 100% SIMULADO com duas unidades; não constitui validação externa, case ou resultado medido.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-10T12:00:00Z'), expiresAt:asISO('2027-02-28T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:caixaclara:demo', solutionId:'solution:caixaclara-v1', kind:'demo',
   statement:'Roteiro de conferência de caixa apenas SIMULADO para demonstração.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-08T12:00:00Z'), expiresAt:asISO('2027-01-31T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:caixaclara:documentation', solutionId:'solution:caixaclara-v1', kind:'documentation',
   statement:'Ficha funcional fictícia descreve uso em balcão e ausência de consulta a estoque.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-08T12:00:00Z'), expiresAt:asISO('2027-01-31T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:vitrineretorno:demo', solutionId:'solution:vitrineretorno-v1', kind:'demo',
   statement:'Demonstração INVENTADA de lembretes de contato com limitações de fluxo e treinamento.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-09T12:00:00Z'), expiresAt:asISO('2027-01-15T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:vitrineretorno:documentation', solutionId:'solution:vitrineretorno-v1', kind:'documentation',
   statement:'Ficha técnica simulada de processamento restrito de contatos e implantação em 14 horas.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-09T12:00:00Z'), expiresAt:asISO('2027-01-15T23:59:59Z'), reviewStatus:'valid_for_demo'},
  {id:'ev:fechorapido:documentation', solutionId:'solution:fechorapido-v1', kind:'documentation',
   statement:'Minuta FICTÍCIA não revisada; preço mínimo, treinamento e implantação ainda são desconhecidos.',
   sourceMode:'synthetic', checkedAt:asISO('2026-11-11T12:00:00Z'), expiresAt:asISO('2027-01-31T23:59:59Z'), reviewStatus:'pending'},
  {id:'ev:visordelegado:pilot', solutionId:'solution:visordelegado-v1', kind:'pilot',
   statement:'Piloto INVENTADO com evidência EXPLICITAMENTE EXPIRADA, sem autorização de recomendação.',
   sourceMode:'synthetic', checkedAt:asISO('2026-08-15T12:00:00Z'), expiresAt:asISO('2026-10-01T23:59:59Z'), reviewStatus:'expired'},
];

/** Dados de UX para exibição: mantidos APARTE do contrato AG-01, sem mudar o motor. */
export interface SolutionDisplayDetails {
  categoryLabel: string;
  functionDescriptions: string[];
  indispensableDependencies: string[];
  optionalIntegrations: string[];
  priceExplanation: string; // texto de simulação OU 'desconhecido'
  setupCostCents: number|null; // custo ilustrativo, NÃO componente do teto mensal do AG-01
  support: {channel: string; simulatedServiceWindow: string; trainingHours: number|null};
  maturity: {stage: string; observation: string};
  mobileSupported: boolean;
  offlineSupported: boolean;
  pilotConditions: string;
  simulationNotice: 'SIMULADO — sem vínculo comercial ou evidência real';
}

export const solutionDisplayDetails: Record<string, SolutionDisplayDetails> = {
  'solution:estoqueponte-v1': {
    categoryLabel:'Gestão e consulta de estoque',
    functionDescriptions:['Consulta sintética por SKU e unidade','Apoio à resposta de pedidos por WhatsApp','Visualização em dispositivo móvel'],
    indispensableDependencies:['ERP X fictício já operacional','Acesso de leitura à base do ERP X','Internet durante consultas'],
    optionalIntegrations:['Exportação manual de relatório CSV'],
    priceExplanation:'R$ 199/mês — valor mínimo SIMULADO; não é cotação', setupCostCents:5000,
    support:{channel:'Chat simulado',simulatedServiceWindow:'Seg–sex, 9h–18h (fictício)',trainingHours:2},
    maturity:{stage:'Piloto documentado fictício',observation:'Três evidências artificiais vigentes na data de referência; nenhuma validação real'},
    mobileSupported:true,offlineSupported:false,
    pilotConditions:'Demonstração fictícia de duas unidades usando ERP X; AC revisa antes do encaminhamento',
    simulationNotice:'SIMULADO — sem vínculo comercial ou evidência real',
  },
  'solution:caixaclara-v1': {
    categoryLabel:'Conciliação de vendas e caixa',
    functionDescriptions:['Conferir totais de fechamento','Apontar divergências de lançamentos'],
    indispensableDependencies:['Exportação manual de registros de caixa','Uso em balcão ou operação mista'],
    optionalIntegrations:['Importação fictícia de CSV'],
    priceExplanation:'R$ 89/mês — valor mínimo SIMULADO; não é cotação',setupCostCents:0,
    support:{channel:'Central simulada de ajuda',simulatedServiceWindow:'Seg–sex, 10h–17h (fictício)',trainingHours:1},
    maturity:{stage:'Protótipo demonstrado fictício',observation:'Duas evidências simuladas válidas; não existe comprovação externa'},
    mobileSupported:true,offlineSupported:false,pilotConditions:'Piloto fictício com fechamento de 5 dias',
    simulationNotice:'SIMULADO — sem vínculo comercial ou evidência real',
  },
  'solution:vitrineretorno-v1': {
    categoryLabel:'Relacionamento e acompanhamento comercial',
    functionDescriptions:['Organizar retorno a contatos','Apoiar lembretes pelo WhatsApp','Visualizar histórico demonstrativo móvel'],
    indispensableDependencies:['Rotina de autorização para contato (simulada)','Internet e responsável interno pelo acompanhamento'],
    optionalIntegrations:['Importação fictícia de contatos de planilha'],
    priceExplanation:'R$ 180/mês — valor mínimo SIMULADO; não é cotação',setupCostCents:2000,
    support:{channel:'E-mail simulado (sem endereço público)',simulatedServiceWindow:'Dias úteis, horário comercial (fictício)',trainingHours:3},
    maturity:{stage:'Demonstração restrita fictícia',observation:'Parcial para lojas que exigem treinamento de até duas horas; duas evidências simuladas'},
    mobileSupported:true,offlineSupported:false,pilotConditions:'Necessária revisão de fluxo, treinamento e condições de mensagens',
    simulationNotice:'SIMULADO — sem vínculo comercial ou evidência real',
  },
  'solution:fechorapido-v1': {
    categoryLabel:'Conciliação de vendas e caixa',
    functionDescriptions:['Conferência preliminar de valores','Relatório de inconsistências (proposto)'],
    indispensableDependencies:['Preço mínimo ainda desconhecido','Implantação ainda não documentada'],
    optionalIntegrations:['Importação CSV em estudo'],
    priceExplanation:'Desconhecido (unknown) — não converter para R$ 0',setupCostCents:null,
    support:{channel:'Não confirmado',simulatedServiceWindow:'Não confirmado',trainingHours:null},
    maturity:{stage:'Ficha em verificação fictícia',observation:'Evidência pendente: não recomendável até curadoria'},
    mobileSupported:false,offlineSupported:false,pilotConditions:'Pedir documentos e orçamento antes de considerar piloto',
    simulationNotice:'SIMULADO — sem vínculo comercial ou evidência real',
  },
  'solution:visordelegado-v1': {
    categoryLabel:'Consulta legada de estoque',
    functionDescriptions:['Consulta de saldos dependente de ERP X','Relatório de duas unidades'],
    indispensableDependencies:['ERP X fictício obrigatório','Ficha de curadoria expirada'],
    optionalIntegrations:[],
    priceExplanation:'R$ 149/mês — preço antigo SIMULADO, sem validade comercial',setupCostCents:null,
    support:{channel:'Histórico fictício; não ativo',simulatedServiceWindow:'Não confirmado',trainingHours:2},
    maturity:{stage:'Piloto fictício expirado',observation:'Ficha e evidência vencidas em 01/10/2026'},
    mobileSupported:true,offlineSupported:false,pilotConditions:'Não oferecer demonstração como match até revalidação de curadoria',
    simulationNotice:'SIMULADO — sem vínculo comercial ou evidência real',
  },
};

/** Nunca chamar de evidência verificada: retorna apenas fixtures fabricadas. */
export function evidenceForSolution(solutionId: string): CatalogEvidence[] {
  return catalogEvidence.filter(e => e.solutionId === solutionId);
}
