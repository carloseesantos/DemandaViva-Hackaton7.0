# AG-05 → AG-09 / AG-04 — Notas de UX para catálogo fictício

**Aviso persistente (cabeçalho e detalhes):** “Demonstração. Startups, soluções, custos, evidências e pilotos são fictícios; não representam parceiros nem validação de mercado.” A indicação `isDemo:true` não basta: a interface precisa de texto visível e acessível. Usar `CATALOG_DISCLOSURE` e `solutionDisplayDetails[solutionId].simulationNotice`.

**Cartão de solução:** nome; **startup fictícia**; categoria; dor principal; requisitos atendidos; dependências indispensáveis; status `CURATION_LABELS`; custo mensal SIMULADO ou **desconhecido**; taxa de implantação ilustrativa separada; data de vencimento; número de evidências **SIMULADAS**; cobertura `regional_demo` fictícia; suporte/maturidade demonstrativos. Nunca apresentar preço `null` como R$ 0 ou “sob consulta” sem explicitar ausência de dado.

**Detalhe EstoquePonte:** colocar o pré-requisito no topo: **“Exige ERP X; não funciona somente com planilha ou WhatsApp”**. Não usar badge genérico “Compatível com WhatsApp” sem explicar a dependência. O aplicativo **não** integra de fato ERP ou WhatsApp; são capacidades inventadas no catálogo.

**Resultado A:** “Correspondência de demonstração: 90/100 (calculado com regras propostas pela equipe). Requer revisão simulada da AC antes de contato/demonstração.” Mostrar seis gates, cinco notas, explicações, custos fictícios e validade. Não rotular “aprovado pela FACESP”.

**Resultado B:** “Não identificamos uma solução elegível no catálogo consultado, considerando as restrições informadas.” Abaixo, motivo objetivo “EstoquePonte exige ERP X; sua loja utiliza planilha e WhatsApp”. **Não renderizar score vazio, zero ou 90 riscado**; o objeto `MatchResult` não possui `score`. A ação correta é “Gerar minuta de briefing” e oferecer revisão pela AC, **simulada**. Não informar “não existe software no mercado”.

**Resultado C:** “Precisamos completar os dados para avaliar compatibilidade”; indicar ERP, requisitos, restrições e indicador faltantes. Não exibir lista de não-matches nem criar briefing definitivo. `NeedDraft` é local; nenhum envio ao Supabase.

**Resultado D:** “Compatibilidade condicional (72/100 na simulação)”, explicar requisito desejável de treinamento curto não coberto e tempo estimado de implantação. Botão “Solicitar esclarecimentos (simulação)”, nunca “Contratar agora”. A AC deve revisar a adaptação antes de qualquer indicação real.

**Status problemáticos:** `under_review` e preço desconhecido ⇒ “Informações pendentes — não recomendável neste momento”; `expired` ⇒ “Ficha expirada — precisa de nova curadoria”. Nenhuma dessas fichas recebe match definitivo por score.

**Evidência:** em cada item mostrar `sourceMode:'synthetic'`, tipo (demo/documentation/pilot/reference), texto e `checkedAt`/`expiresAt`. Separar visualmente “Evidências fictícias usadas na demonstração” de “Evidências reais verificadas: nenhuma”. Não inventar logos, certificados, links externos ou depoimentos.

**Associação / persistência:** ficha de startup, solução e evidências vêm do bundle local; nenhuma tentativa de CRUD em Supabase. Somente novas demandas qualificadas e confirmadas podem passar pelo repositório remoto, sujeito a G1S. Mudança de visão para AC **não** representa autenticação. Simulação de encaminhamento, revisão, chamada e resposta não significa ato real de startup/AC.

**Acessibilidade e entendimento:** motivos de bloqueio em linguagem do lojista, sem depender de cor; prazo e preço com rótulo “fictício”; sempre permitir detalhar critérios; datas em fuso local com referência UTC interna; em acessibilidade mencionar “match simulado” por extenso.
