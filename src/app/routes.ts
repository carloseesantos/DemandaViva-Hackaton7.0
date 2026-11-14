export type Perspective = 'lojista' | 'ac' | 'startup' | 'regional';

export interface AppRouteDefinition {
  id: string;
  path: string;
  title: string;
  summary: string;
  perspective: Perspective | null;
  /** Agente dono da tela que substituirá o placeholder. */
  owner: 'AG-09';
}

// Rotas provisórias do scaffold AG-02. Nomes/paths finais dependem de docs/UX_FLOW.md (AG-04);
// mudanças devem ser feitas aqui, mantendo um único inventário de rotas.
export const APP_ROUTES: readonly AppRouteDefinition[] = [
  {
    id: 'home',
    path: '/',
    title: 'Início',
    summary: 'Apresentação e escolha de perspectiva da demonstração (não é login).',
    perspective: null,
    owner: 'AG-09',
  },
  {
    id: 'need-interview',
    path: '/lojista/diagnostico',
    title: 'Diagnóstico guiado',
    summary: 'Entrevista que produz um NeedDraft local até a confirmação da ficha QualifiedNeed.',
    perspective: 'lojista',
    owner: 'AG-09',
  },
  {
    id: 'need-result',
    path: '/lojista/resultado/:needId',
    title: 'Resultado da avaliação',
    summary: 'Saídas A (match elegível), B (sem match no catálogo) ou C (dados insuficientes).',
    perspective: 'lojista',
    owner: 'AG-09',
  },
  {
    id: 'brief',
    path: '/briefing/:needId',
    title: 'Minuta de briefing técnico',
    summary: 'Briefing derivado de uma necessidade qualificada sem solução elegível no catálogo.',
    perspective: null,
    owner: 'AG-09',
  },
  {
    id: 'ac-panel',
    path: '/ac/painel',
    title: 'Painel da Associação Comercial',
    summary: 'Seeds fictícias + demandas remotas deduplicadas; contagem real, revisão simulada.',
    perspective: 'ac',
    owner: 'AG-09',
  },
  {
    id: 'ac-cluster',
    path: '/ac/clusters/:clusterId',
    title: 'Similaridade sugerida',
    summary: 'Revisão simulada de agrupamento e minuta de chamada.',
    perspective: 'ac',
    owner: 'AG-09',
  },
  {
    id: 'startup-calls',
    path: '/startup/chamadas',
    title: 'Chamadas simuladas',
    summary: 'Chamadas abertas em modo demonstração.',
    perspective: 'startup',
    owner: 'AG-09',
  },
  {
    id: 'startup-call',
    path: '/startup/chamadas/:callId',
    title: 'Chamada e resposta simulada',
    summary: 'Resposta fictícia de startup; sem compromisso real.',
    perspective: 'startup',
    owner: 'AG-09',
  },
  {
    id: 'regional',
    path: '/regional',
    title: 'Visão regional',
    summary: 'Indicadores agregados derivados de dados sintéticos, sem dados identificáveis.',
    perspective: 'regional',
    owner: 'AG-09',
  },
];

export const PERSPECTIVE_LINKS: ReadonlyArray<{ perspective: Perspective; label: string; to: string }> = [
  { perspective: 'lojista', label: 'Lojista', to: '/lojista/diagnostico' },
  { perspective: 'ac', label: 'AC', to: '/ac/painel' },
  { perspective: 'startup', label: 'Startup', to: '/startup/chamadas' },
  { perspective: 'regional', label: 'Regional/FACESP', to: '/regional' },
];
