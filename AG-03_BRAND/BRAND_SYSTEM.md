# DEMANDA VIVA — BRAND SYSTEM

**Agente:** AG-03 — Direção de marca e UX visual  
**Versão:** 1.0 (proposta para aprovação da equipe)  
**Data:** 14/11/2026  
**Produto:** DEMANDA VIVA — Desafio FACESP, Hackathon Connect 7.0  
**Status:** proposta visual implementável; não é aprovação institucional, jurídica ou de marca registrada.

## 1. Fontes lidas e hierarquia de decisões

Fontes acessadas no Drive oficial: **00 — Decisão de marca e identidade verbal**, **01 — Rede decisória e governança**, **02 — Diagnóstico, catálogo e régua**, **03 — Briefing e chamada às startups**, **04 — Mapas C4 e fluxos decisórios** e **06 — ADR-002 Persistência híbrida de demandas**. Todos estavam acessíveis. A documentação de agentes (07) também foi consultada para alinhamento de entregas AG-09/11.

- **Fechado:** nome `Demanda Viva`, com `DEMANDA` dominante e `VIVA` complementar; não renomear; produto organiza necessidades, recomenda soluções elegíveis do catálogo ou cria briefing quando não há match, sem criar software.
- **Referência, não institucionalizado:** slogan “Necessidades que viram oportunidades.”
- **Proposta do AG-03, sujeita a aprovação:** paleta definitiva, tipografia, símbolo, hierarquia e estilo dos componentes.
- **Arquitetura do MVP:** React + TypeScript + Vite em Cloudflare Pages; catálogo e seeds sintéticos locais; somente novas demandas qualificadas persistidas no Supabase (conforme arquitetura aprovada no contexto de execução; ADR-002 é documento originalmente proposto).
- **Integridade da demonstração:** dados fictícios e papéis simulados claramente rotulados em cada perspectiva; o score vem da régua determinística após gates; a UI não finge IA generativa, validação real das startups, autorização real da AC ou sincronização remota sem retorno confirmado.

## 2. Plataforma de marca

**Promessa funcional:** transformar uma dor operacional em uma decisão justificável ou em oportunidade estruturada para inovação aberta.  
**Posicionamento:** tecnologia clara para quem vende, governança visível para quem conecta, requisitos úteis para quem desenvolve.  
**Personalidade:** direta, competente, humana sem sentimentalismo; otimista sem prometer resultados garantidos; moderna sem estética de chatbot.  
**Arquétipo visual:** infraestrutura de conexão, não órgão público nem aplicativo de conversa.

### Nome e voz

- Assinatura visual: `DEMANDA` com maior peso e tamanho; `VIVA` a 70–74% da altura tipográfica, no mesmo eixo de base, em cor complementar.
- Texto corrido: **Demanda Viva**. Nunca usar “DV” como substituto do nome em primeira referência.
- Slogan autorizado apenas como **slogan de referência do projeto**: “Necessidades que viram oportunidades.”; não atribuir à FACESP.
- Alternativas em teste, NÃO aprovadas: “Toda necessidade tem um próximo passo.” e “Do problema claro à oportunidade possível.”
- Verbo principal em UI: **Qualificar**, **Comparar**, **Entender**, **Registrar**, **Revisar**, **Explorar**. Evitar “a IA resolveu” e “geramos seu software”.

## 3. Direções exploradas

| Direção | Conceito e símbolo | Wordmark | Paleta (HEX) | Tipografia livre | Avaliação |
|---|---|---|---|---|---|
| **01 Ponte Viva — RECOMENDADA** | Um percurso que se ramifica em duas saídas: solução elegível ou briefing. Nós representam lojista, mediação e oportunidade. | `DEMANDA` em marinho, bold 800; `VIVA` em petróleo, semibold 600 a 72% | marinho `#11273A`, petróleo `#075E6B`, água `#25BAA7`, fundo `#F7FAFC`, branco `#FFFFFF` | **Manrope** (OFL), fallback Inter/system-ui | Melhor equilíbrio entre confiança, calor humano e escalabilidade UI/pitch. Contrastes funcionais validados. |
| **02 Mercado em Movimento** | Barras de fluxo em direção a um nó ativo; marca de alto dinamismo. | `DEMANDA` em `#182B62`, 800; `VIVA` em `#3152CC`, 600 a 70% | azul noturno `#182B62`, cobalto `#3152CC`, âmbar `#EF9547`, fundo `#EDF2FF` | **Sora** (OFL) + Inter | Boa energia de startup; disputa atenção com diagnóstico e estados. |
| **03 Sinal de Oportunidade** | Geometria de rotas e terminais; sinal de rede. | `DEMANDA` em `#1F2D2F`, 800; `VIVA` em `#50672A`, 600 a 72% | grafite `#1F2D2F`, oliva `#50672A`, lima `#A9CD47`, fundo `#F2F5E8` | **Plus Jakarta Sans** (OFL), fallback system-ui | Distinta e ousada; exige cuidado extra em públicos de baixa familiaridade digital. |

**Por que 01:** reaproveita de modo evolutivo o azul-marinho + verde-água provisórios documentados no 00 e nos slides C4; mantém leitura sólida para a AC, interface calma para o lojista e linguagem contemporânea para startups. O símbolo com **duas saídas** traduz a tese do produto: a demanda não morre quando não há correspondência no catálogo. As direções 02 e 03 permanecem somente exploratórias.

## 4. Sistema visual recomendado — Ponte Viva

### Paleta operacional

| Token semântico | HEX | Uso |
|---|---|---|
| `--dv-color-ink` | `#11273A` | Marca DEMANDA, títulos, textos predominantes |
| `--dv-color-primary` | `#075E6B` | CTA primário, links, marca VIVA |
| `--dv-color-primary-hover` | `#064C58` | Hover de botão e link |
| `--dv-color-accent` | `#25BAA7` | Linha de conexão, ilustração, ênfase decorativa; **nunca** texto branco pequeno sobre este fundo |
| `--dv-color-bg` | `#F7FAFC` | Fundo de aplicativo |
| `--dv-color-surface` | `#FFFFFF` | Cartões e campos |
| `--dv-color-text-muted` | `#52687A` | Microcopy, textos secundários legíveis |
| `--dv-color-border` | `#748D9B` | Bordas funcionais de campos (>=3:1 contra branco) |
| `--dv-color-border-subtle` | `#C6D5DD` | Bordas decorativas de cartões; não delimitar campo interativo sozinha |
| `--dv-color-focus` | `#075E6B` | Contorno de foco visível de 3px com 2px de offset |

### Cores de estados (com legenda textual sempre)

| Estado | Texto | Superfície | Rótulo visual acessível |
|---|---|---|---|
| Solução recomendada / salvamento confirmado | `#166534` | `#ECFDF3` | “Recomendado”, “Registrado na nuvem” somente após confirmação |
| Compatibilidade condicional / atenção | `#854D0E` | `#FEF3C7` | “Requer esclarecimentos” |
| Solução inelegível | `#991B1B` | `#FEF2F2` | “Inelegível — requisito obrigatório não atendido” |
| Dados insuficientes | `#075985` | `#E0F2FE` | “Dados insuficientes — completar diagnóstico” |
| Processando/gravação em curso | `#475569` | `#F1F5F9` | “Salvando demanda…” |
| Offline/falha remota | `#9A3412` | `#FFF7ED` | “Não sincronizada”; oferecer retry |
| Conteúdo fictício | `#164E63` | `#ECFEFF` | “DEMONSTRAÇÃO • DADOS FICTÍCIOS” |

**Regra de percepção:** verde = status positivo, não substitui evidência; vermelho = bloqueio explícito, não punição ao usuário; azul = informação adicional pendente; laranja = erro/risco operacional. Rótulo + ícone + frase explicativa acompanham cor.

### Tipos e hierarquia

- Família: **Manrope** `400, 500, 600, 700, 800` (licença OFL; distribuição por CDN ou arquivo open-source licenciado). Fallback: `Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif`.
- Wordmark desktop: DEMANDA ~28px/800 e VIVA ~20px/600; pitch: DEMANDA 64–80px e VIVA 46–58px; mobile: DEMANDA ~22px e VIVA ~16px. Não reproduzir tamanhos estritos em SVG sem conferir render.
- App: H1 32/40 (mobile 28/36); H2 24/32; H3 20/28; corpo 16/24; legenda 14/20; indicador numérico 32/40, tabular.
- Corpo nunca abaixo de 14px; informações essenciais preferencialmente 16px. Texto 100% responsivo e zoom até 200% sem clipping.

### Formas, iconografia e movimento

- Cantos: 8px controle, 12px cartão, 16px destaque; não usar pílulas em todos os elementos.
- Grid: base 8px com subtokens 4px; largura central 1120px (desktop), conteúdo diagnóstico 720px; mobile largura fluida com 16px de margem.
- Ícones: biblioteca livre **Lucide** (traço 1.75–2px), 20px UI e 24px em chamadas: `store`, `clipboard-check`, `filter`, `git-branch`, `link-2`, `file-text`, `building-2`, `rocket`, `check-circle-2`, `alert-circle`, `refresh-cw`, `cloud-off`.
- Evitar robôs, balões de chat como identidade, estrelinhas de “IA mágica”, ilustrações com selos de certificação.
- Motion: transitions de 120–180ms para hover/focus, 200ms para expansão; sem animação contínua. Em `prefers-reduced-motion: reduce`, remover movimento não essencial. Loading com rótulo textual.

### Assinaturas, proteção e uso

**Horizontal:** símbolo de ramificação à esquerda, `DEMANDA` + `VIVA` na mesma linha, gap visual de 8–12px. DEMANDA 800, VIVA 600 com cap-height relativa ~72%; a palavra VIVA não deve parecer um segundo produto. Slogan em linha própria somente quando houver espaço (pitch/capa), nunca dentro do logotipo mínimo.

**Compacta:** símbolo + assinatura tipográfica em duas linhas (`DEMANDA` acima, `VIVA` abaixo alinhada à esquerda) em larguras intermediárias; em favicon, usar somente símbolo (não letras `DV`). **Não usar o favicon como única identificação textual no primeiro acesso.**

**Área de respiro:** ao redor do conjunto, mínimo de `0.5 × altura da letra D`; preferir 16px ou mais em UI. **Tamanho mínimo:** horizontal >= 180px de largura em interfaces, compacta >= 120px; símbolo isolado >= 24px (favicon SVG pode ser 16px com versão simplificada). Não esticar, rotacionar, aplicar sombras, degradês ou substituir a paleta sem verificação de contraste.

**Fundos:** preferencialmente branco ou `#F7FAFC`. Em marinho, a marca branca usa DEMANDA branco e VIVA `#C6F7EB`; esta assinatura reversa é uma especificação, não arquivo vetorial fornecido. A água `#25BAA7` é acento, não cor de texto para UI regular.

**Assets neste pacote:** `logo-horizontal.svg`, `logo-compact.svg`, `favicon.svg`, `directions-board.svg`. Os SVGs de lettering mantêm `<text>` editável: para produção final, converter fonte licenciada em contornos ou garantir carregamento da fonte e revisão visual em navegadores/sistemas.

## 5. Arquitetura visual de produto

### Header (sem projetar a página completa)

- Esquerda: assinatura horizontal; abaixo ou ao lado, contexto curto “Inovação aberta para o varejo”.
- Centro/direita: navegação de áreas funcional: `Diagnóstico`, `Soluções`, `Demandas da rede`; na demonstração, mostrar `Visão: Lojista | Associação | Startup | Rede (simulação)` claramente, sem sugerir autorização real.
- Na borda superior ou canto direito, sinal fixo **“DEMONSTRAÇÃO • DADOS FICTÍCIOS”** em contraste AA. Em telas pequenas, manter visível sem depender de menu fechado.

### Resultado A: match elegível

- Cabeçalho textual “Solução elegível no catálogo de demonstração”.
- Logo abaixo: cartão de solução fictícia, com `90/100` **somente** se o motor calcular 90 após os seis filtros. Não usar `90% de chance de sucesso`.
- Blocos separados: filtros aprovados; justificativa por critério; evidências simuladas; limitações; custo simulado ou “não informado”; `Revisão da Associação (simulada)`; CTA “Solicitar demonstração (simulação)”.
- Um candidato inelegível não recebe pontuação nem cartão de recomendação, mesmo que seja parecido textualmente.

### Resultado B: sem match elegível

- Título neutro “Nenhuma solução elegível no catálogo consultado”.
- Explicação breve do filtro não atendido (ex.: ERP X obrigatório, inexistente na loja), sem afirmar ausência de soluções no mercado.
- Prioridade visual para “Briefing técnico preparado” + “Demandas semelhantes para revisão da Associação”. **Não** usar imagem de erro, final de linha ou tela vazia: o segundo percurso é uma continuação positiva do produto.
- CTA “Revisar briefing”; no painel da Associação “Revisar agrupamento” e “Preparar chamada (simulação)”.

### Resultado C: dados insuficientes

- “Ainda faltam informações para verificar compatibilidade”.
- Lista objetiva de campos faltantes; CTA “Completar diagnóstico”. **Sem score definitivo e sem briefing conclusivo.**

### Persistência e simulação

- Salvar apenas necessidade qualificada quando confirmado pelo usuário. Mostrar “Salvando…” durante `repository.save`; exibir “Demanda registrada na nuvem — ID …” **apenas** após retorno bem-sucedido do Supabase.
- Offline/erro: “Não foi possível sincronizar. A demanda permanece apenas nesta sessão [ou rascunho local, se implementado].” Exibir “Tentar novamente”.
- Seeds locais, registros remotos e visão simulada de papéis devem ser compreensíveis; o contador de demandas usa lista real mesclada e deduplicada, nunca número fixo.
- “Critérios e pesos propostos pela equipe para esta demonstração. Não representam metodologia oficial FACESP.”

## 6. Acessibilidade e validação

**Referência:** WCAG 2.2 AA como meta de implementação (não declarar conformidade do produto antes de testar telas reais). Contraste normal >= 4.5:1, texto grande >= 3:1, componentes/indicadores não textuais >= 3:1, foco visível e navegabilidade por teclado. Ver `CONTRAST_AUDIT.md` para pares e razões calculadas matematicamente a partir de HEX. A aprovação de tokens **não comprova** que todas as telas renderizadas passaram em auditoria.

- Campos com `<label>` visível, `aria-describedby` para dica/erro, estados de carregamento em `role=status`, erros em `role=alert` quando necessário; não depender exclusivamente de placeholder.
- Progresso do diagnóstico em texto “Etapa 2 de 5” e em barra com semântica.
- Ícones decorativos `aria-hidden=true`; status textual obrigatório.
- Para estados de cartão com fundo suave e sem borda contrastante, usar título/status textuais para identificação. O campo interativo utiliza borda `#748D9B` (>=3:1 sobre branco); a borda suave `#C6D5DD` só serve em cartões decorativos.
- Teclas, leitor de tela, responsividade 320px e zoom 200% devem ser exercitados pelo AG-09/10 em produto real.

## 7. Uso no pitch

- Capa: wordmark de alta visibilidade, slogan de referência abaixo, selo apenas textual “Desafio FACESP • Hackathon Connect 7.0”.
- Slide do ciclo: **Demanda → Diagnóstico → Filtros → [Solução elegível | Briefing + novas oportunidades]**; bifurcação no petróleo com ramo em verde-água. Não transmitir que o motor executa um fluxo de IA aberta sem evidência.
- Slide dos públicos: ícones de loja, edifício de associação, foguete de startup e rede agregada; papéis são diferentes, conectados pelo mesmo problema.
- Painel de demonstração: faixa visível “Exemplo fictício” em todos os slides com dados simulados (inclusive “90/100”, 4 relatos, 2 associações e metas ilustrativas).
- Rodapé de metodologia: “Régua e pesos propostos pela equipe. Não oficiais FACESP.”

## 8. Aprovações pendentes

1. A equipe aprova a direção 01, símbolo e paleta? O nome **já está aprovado** e não entra em votação.
2. O slogan de referência será usado no pitch apenas ou institucionalizado no futuro? **Não institucionalizar sem decisão.**
3. Aprovação final dos arquivos vetoriais após revisão de kerning/fontes e testes em mobile, projetor e Figma/Illustrator/Inkscape.
4. Avaliação legal posterior de anterioridade/semelhança de marca, domínio e ativos digitais. Nenhuma garantia de registrabilidade.

## 9. Handoff obrigatório

### Para AG-09 — Frontend

- Consumir `tokens.css` e/ou `tokens.json`; adicionar `data-demo`/faixa textual de demonstração em todas as perspectivas.
- Aplicar as especificações `UI_COMPONENT_GUIDE.md` e os snippets em `APPLICATION_EXAMPLES.md` sem tratar exemplos como páginas finais: AG-04 é dono dos fluxos/telas.
- Integrar acessibilidade, foco e `prefers-reduced-motion`; verificar com testes em browser no produto final. Não renderizar nota em candidato reprovado em gate.
- Não declarar “salvo na nuvem” antes da confirmação `repository.save` e mostrar falha/offline/retry.
- Não tratar switcher de perfil demonstrativo como autenticação. Não usar logotipo oficial FACESP sem autorização.

### Para AG-11 — Pitch e banca

- Usar a assinatura `DEMANDA` dominante + `VIVA` complementar na capa e slides. Referência atual: “Necessidades que viram oportunidades.” com aprovação editorial pendente.
- Mostrar duas saídas equivalentes em valor: match elegível e demanda que vira briefing/chamada, sem software criado automaticamente.
- Indicar dados 100% fictícios, validações simuladas e pesos não oficiais FACESP. Score 90/100 é cenário simulado proposto no Doc 02 e depende de implementação correta.
- Utilizar `directions-board.svg` apenas para comparação interna; usar direção 01 no pitch **após aprovação da equipe**.
- Solicitar ao AG-09 capturas da UI realmente integrada e ao AG-10 URL confirmada; não usar métricas/URL inventadas.

**Status de entrega AG-03:** concluída a proposta e os assets implementáveis; pendente aprovação humana da direção e QA de interface após integração.
