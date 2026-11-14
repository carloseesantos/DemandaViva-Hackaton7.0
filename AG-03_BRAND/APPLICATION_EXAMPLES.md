# DEMANDA VIVA — Exemplos de aplicação (não são telas completas)

**Escopo AG-03:** trechos de UI para orientar AG-09. **AG-04 é responsável pelas jornadas definitivas.** Regras, dados e estados abaixo são demonstrativos; nenhum trecho faz I/O real.

## 1. Header: wordmark + demo disclosure

```tsx
<header className="dv-header">
  <a className="dv-brand" href="/" aria-label="Demanda Viva — início">
    <img src="/brand/logo-horizontal.svg" alt="Demanda Viva" width="224" height="56" />
  </a>
  <nav aria-label="Navegação principal">
    <a href="/diagnostico">Diagnóstico</a>
    <a href="/solucoes">Soluções</a>
    <a href="/demandas">Demandas da rede</a>
  </nav>
  <strong className="dv-demo-pill" aria-label="Ambiente de demonstração com dados fictícios">
    DEMONSTRAÇÃO • DADOS FICTÍCIOS
  </strong>
</header>
```

**Notas:** no mobile, menu pode recolher, mas **não** recolher o aviso de dados fictícios. Links são ilustrativos e rotas dependem do AG-04. Em rotas sem autenticação, usar `Visão demonstrativa: Lojista / Associação / Startup / Rede` no corpo, nunca tratá-lo como controle de acesso.

## 2. Resultado A — match elegível

```tsx
<section aria-labelledby="resultado-a">
  <p className="dv-status dv-status--demo">DEMONSTRAÇÃO • DADOS FICTÍCIOS</p>
  <h2 id="resultado-a">Solução elegível no catálogo de demonstração</h2>
  <article className="dv-surface">
    <h3>EstoquePonte <small>— solução fictícia</small></h3>
    <p className="dv-status dv-status--recommended">Solução recomendada — sujeita à revisão da AC (simulada)</p>
    <p><strong>90/100</strong> de compatibilidade calculada após aprovação dos filtros obrigatórios.</p>
    <p><strong>Critério técnico:</strong> integração compatível com ERP X declarado no cenário.</p>
    <p>Veja os filtros, critérios, limitações e evidências simuladas antes de decidir.</p>
    <button type="button">Solicitar demonstração (simulação)</button>
  </article>
  <small>Pesos e faixas propostos pela equipe; não são critérios oficiais FACESP.</small>
</section>
```

**Invariante:** 90/100 **não é hardcoded na implementação**. É apenas o valor esperado do cenário fictício A do Doc 02 quando o algoritmo calcula função 5, técnica 5, economia 4, operação 4 e evidência 4, todos os gates aprovados. Para estado real: usar `result.score` e renderizar cartão A apenas se `result.eligibility === 'eligible'`.

## 3. Resultado B — nenhum match elegível no catálogo

```tsx
<section aria-labelledby="resultado-b">
  <p className="dv-status dv-status--demo">DEMONSTRAÇÃO • DADOS FICTÍCIOS</p>
  <h2 id="resultado-b">Nenhuma solução elegível no catálogo consultado</h2>
  <p>A solução fictícia EstoquePonte exige ERP X, que não está disponível nesta loja.</p>
  <p>Isso não significa que não exista solução no mercado.</p>
  <article className="dv-surface">
    <h3>Briefing técnico preparado</h3>
    <p>Problema, processo, requisitos obrigatórios, restrições e meta organizados para revisão.</p>
    <p>O sistema não desenvolveu um software. A Associação poderá revisar demandas semelhantes e avaliar uma chamada às startups.</p>
    <button type="button">Revisar briefing</button>
  </article>
</section>
```

**Invariante:** **não** exibir score da EstoquePonte no cenário B. A chamada é uma etapa posteriormente revisada pela AC e **simulada** no MVP, a menos que a implementação realmente tenha outro comportamento autorizado e validado.

## 4. Resultado C — dados insuficientes

```tsx
<section aria-labelledby="resultado-c">
  <h2 id="resultado-c">Faltam informações para verificar compatibilidade</h2>
  <p className="dv-status dv-status--insufficient">Dados insuficientes</p>
  <ul>
    <li>Informe os sistemas e integrações disponíveis.</li>
    <li>Confirme os requisitos obrigatórios.</li>
  </ul>
  <button type="button">Completar diagnóstico</button>
</section>
```

**Invariante:** sem match definitivo, sem score e sem briefing concluído.

## 5. Persistência remota, sob o contrato AG-08

```tsx
function SaveStatus({ status, id }: {
  status: 'idle' | 'saving' | 'saved' | 'offline' | 'error';
  id?: string;
}) {
  if (status === 'saving') return <p role="status">Salvando demanda…</p>;
  if (status === 'saved' && id) return <p role="status">Demanda registrada na nuvem — ID {id}</p>;
  if (status === 'offline' || status === 'error') return (
    <p role="alert">Demanda não sincronizada. Verifique sua conexão e tente novamente.</p>
  );
  return null;
}
```

`status='saved'` deve ser emitido somente após sucesso confirmado de `repository.save`. O botão de retry fica a cargo do fluxo AG-09, usando o erro retornado por AG-08. Não inferir êxito por mudança de estado local.

## 6. Anatomia da tela de resultado (esqueleto textual)

```text
[DEMANDA VIVA]          [DEMONSTRAÇÃO • DADOS FICTÍCIOS]
[Resultado do diagnóstico]
[O que entendemos da demanda]
[Requisitos obrigatórios e condições eliminatórias]
┌─────────────────────────────────────────────────┐
│ A: Solução elegível + score somente pós-gates   │
│            OU                                   │
│ B: Sem match no catálogo + briefing + AC        │
│            OU                                   │
│ C: Dados insuficientes + perguntas pendentes    │
└─────────────────────────────────────────────────┘
[Por quê? Evidências | Limitações | Próximo passo]
[Rodapé: metodologia proposta, não FACESP oficial]
```

Não usar este esquema como wireframe final. O AG-04 será a fonte de verdade da navegação e sequência de etapas.
