/** Startup fixtures AG-05 — nomes, entidades e alegações integralmente FICTÍCIOS. */
import type { Startup } from '../domain/types';

export const startups: Startup[] = [
  {
    id: 'startup:pontelab',
    displayName: 'PonteLab (fictícia)',
    summary: 'Simulação de fornecedor de leitura operacional de estoque integrado a ERP X. Não é empresa ou parceria verificada.',
    solutionIds: ['solution:estoqueponte-v1', 'solution:visordelegado-v1'],
    isDemo: true,
  },
  {
    id: 'startup:ritmodados',
    displayName: 'RitmoDados (fictícia)',
    summary: 'Simulação de fornecedor de conciliação de caixa para pequeno varejo.',
    solutionIds: ['solution:caixaclara-v1'],
    isDemo: true,
  },
  {
    id: 'startup:relavarejo',
    displayName: 'RelaVarejo (fictícia)',
    summary: 'Simulação de fornecedor de acompanhamento de contatos comerciais em canais de mensagens.',
    solutionIds: ['solution:vitrineretorno-v1'],
    isDemo: true,
  },
  {
    id: 'startup:pontoapoio',
    displayName: 'PontoApoio (fictícia)',
    summary: 'Simulação de fornecedor ainda em revisão de documentação e preços.',
    solutionIds: ['solution:fechorapido-v1'],
    isDemo: true,
  },
];

/** Informações de contato comerciais são somente papéis inventados; nenhum e-mail real. */
export const startupContacts: Record<string, {responsibleRole: string; nextStep: string; notice: string}> = {
  'startup:pontelab': {responsibleRole: 'Curadoria técnica (personagem fictício)', nextStep: 'Solicitação simulada de demonstração', notice: 'Contato e fornecedor fictícios'},
  'startup:ritmodados': {responsibleRole: 'Especialista de implantação (personagem fictício)', nextStep: 'Solicitação simulada de demonstração', notice: 'Contato e fornecedor fictícios'},
  'startup:relavarejo': {responsibleRole: 'Equipe de produto (personagem fictício)', nextStep: 'Pedido simulado de esclarecimento sobre fluxos', notice: 'Contato e fornecedor fictícios'},
  'startup:pontoapoio': {responsibleRole: 'Equipe de curadoria (personagem fictício)', nextStep: 'Solicitar documentos e custo mínimo', notice: 'Contato e fornecedor fictícios'},
};
