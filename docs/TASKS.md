# DEMANDA VIVA — TASKS / PLANO DE EXECUÇÃO

> **Planejamento 1.0.0 — 14/11/2026** | **PMO:** AG-00 | **Marco atual:** documentação de execução; sem comprovação de desenvolvimento/deploy.
> **Status permitido:** `Proposto` · `Liberado` · `Em andamento` (com evidência) · `Bloqueado` · `Concluído` (com evidência). As ações são instruções futuras, não execuções presumidas.

## 1. Caminho crítico e ordem recomendada

```mermaid
flowchart TD
  A[AG-00: baseline e gates] --> B[AG-01: contrato de dados]
  A --> C[AG-03: marca e tokens]
  B --> G{Gate G1: contrato aprovado?}
  G -->|Sim| D[AG-02: scaffold]
  G -->|Sim| E[AG-05: catálogo]
  G -->|Sim| F[AG-06: seeds e testes]
  G -->|Sim| U[AG-04: UX final]
  D --> H[AG-07: matching + briefing + cluster]
  E --> H
  F --> H
  D --> I[AG-08: Supabase + segurança]
  B --> I
  S{Política RLS/INSERT/SELECT e antiabuso decidida} --> I
  C --> J[AG-09: frontend com mocks]
  U --> J
  D --> J
  H --> K[AG-09: integração real]
  I --> K
  J --> K
  K --> L[AG-10: QA/deploy]
  L --> M[AG-11: pitch final]
  U --> N[AG-11: pitch provisório]
  C --> N
  N --> M
```

**Não confundir paralelo com pré-requisito cumprido.** O scaffold AG-02 não começa sem contrato aprovado; as fixtures AG-05/06 não usam tipos inventados; o motor AG-07 não começa sem fixtures coerentes e arquitetura; AG-08 não abre INSERT público com RLS indefinida; AG-09 pode desenvolver telas com **mocks tipados** após receber seus próprios requisitos, mas não anunciar integração Supabase/motor até testar de ponta a ponta.

## 2. Gates de entrega

| Gate | Condição objetiva de liberação | Responsável pela evidência | Situação inicial |
| --- | --- | --- | --- |
| **G0 — Baseline** | `PROJECT_CONTEXT`, `AGENTS`, `BACKLOG`, `TASKS`, `DECISIONS`, handoff/riscos publicados; fontes e conflitos rastreados | AG-00 | Publicação desses arquivos depende de verificação final no Drive; **revisão da equipe ainda pendente** |
| **G1 — Contrato de dados** | `DATA_MODEL.md` + tipos/códigos/serialização/DDL propostos + A/B/C + merge e schema versionado, com **aprovação explícita** | AG-01 + equipe | **Bloqueado / não evidenciado** |
| **G1S — Segurança de dados** | Decidir Auth Anonymous/Turnstile ou opção com mitigação equivalente, SELECT de demos, limites de inserção e regras de escrita; registrar riscos residuais | Equipe + AG-08/01 | **Pendente / bloqueia INSERT público** |
| **G2 — Base paralela** | Scaffold compila; marca/tokens; UX definitiva; catálogo e seeds coerentes com AG-01 | AG-02/03/04/05/06 | **Aguardando G1** (AG-03 livre) |
| **G3 — Serviços** | Testes automáticos de gates/90 B sem score/C/cluster + migration/RLS + smoke remoto autorizado | AG-07/08 | **Aguardando G2 e G1S** |
| **G4 — Integração** | UX navega A/B/C, AC/startup, persistência entre sessões e estados offline/erro | AG-09 | **Aguardando G2/G3** |
| **G5 — Release QA** | Matriz de testes preenchida, riscos críticos resolvidos ou explicitamente vetados, build/deep-link/mobile/secrets verificados | AG-10 + PMO | **Não iniciado** |
| **G6 — Banca** | URL Pages realmente acessível e testada, roteiro fiel ao release, contingência pronta | AG-10/11 + equipe | **Não iniciado** |

## 3. Work packages por agente

### AG-00 — PMO / governança (R0)

- **T00-01** Revisar 00–07, sintetizar o escopo atual e identificar que ADR-002 corrige **somente** persistência (saída `PROJECT_CONTEXT.md`).
- **T00-02** Publicar matriz de papéis, donos de arquivo, limites e fontes (`AGENTS.md`).
- **T00-03** Definir US P0/P1 e dependências, sem declarar desenvolvimento pronto (`BACKLOG.md`).
- **T00-04** Definir execução por gates, registro de decisões e riscos (`TASKS.md`, `DECISIONS.md`, `HANDOFF_AND_RISKS.md`).
- **T00-05** Solicitar handoffs, registrar aprovações e liberar rodadas somente diante de evidências; acompanhar riscos diariamente/durante sprint.
- **Evidência de aceite:** links verificados no Drive e checklist de conteúdo, seguido de aprovação de baseline pela equipe. **Situação:** documentação preparada nesta execução; aceite colegiado não presumido.

### AG-01 — Contratos e schema (R1; liberado)

- **T01-01** Derivar `Need`, `Requirement`, `Association`, `Startup`, `Solution`, `CatalogEvidence`, `MatchResult`, `Brief`, `DemandCluster`, `InnovationCall`, `StartupResponse` e `DemandRepository` de 01/02/03/ADR-002.
- **T01-02** Estabelecer tabela campo/tipo/obrigatoriedade/validação, enums e status discriminados para A/B/C; separar fixture estática, estado local, ficha confirmada remota e simulação de UI.
- **T01-03** Descrever `public.demo_demands` com SQL **proposto**: UUID, `created_at`, `owner_id` se Auth Anonymous, códigos controlados, texto curto, JSONB limitado, limites/CHECKs, `is_demo=true` e índice mínimo; sem executar banco.
- **T01-04** Definir serialização TS↔SQL, IDs estáveis, política de dedupe/merge seed+remoto, cluster key derivada, migração/versionamento, compatibilidade entre dados locais e remotos.
- **T01-05** Gerar exemplos JSON **coerentes** A/B/C e decidir/propor persistir ficha final versus diálogo (preferência ADR-002: ficha final; decisão colegiada pendente).
- **T01-06** Handoff com decisões necessárias para equipes: credenciais públicas, RLS/SELECT, Auth Anonymous/antiabuso, funções de contrato e matriz de propriedade.
- **Aceite:** contrato sem tipos ambíguos, cobertura P0, fonte/alternativas/diferenças rastreadas; **aprovação humana registrada** para G1. Arquivos/caminhos sugeridos: `docs/DATA_MODEL.md` + snippets completos de TS/SQL.

### AG-03 — Identidade de marca (R1; liberado, paralelo)

- **T03-01** Manter DEMANDA VIVA (nome aprovado) e DEMANDA dominante; apresentar 2–3 direções tipográficas, paletas HEX e recomendação **não automaticamente aprovada**.
- **T03-02** Produzir `docs/BRAND_SYSTEM.md`, tokens CSS/JSON, especificação de logo, aplicação mobile/desktop, card/CTA/status, contraste e acessibilidade.
- **T03-03** Preparar handoff visual e checklist de assets para AG-09/11; não usar logomarca FACESP sem autorização.
- **Aceite:** tokens reproduzíveis, aplicação e rationale documentados; decisões finais de identidade dependem da equipe.

### AG-02 — Scaffold técnico (R2; bloqueado por G1 e repo)

- **T02-01** Confirmar workspace correto; inspecionar `docs/`, `package.json`, `src/` e `git status`; identificar se há repositório existente.
- **T02-02** Criar React + TS + Vite, roteamento, lint/test/build, estrutura modular e README; configurar `npm run build` → `dist`, roteamento compatível com Cloudflare Pages.
- **T02-03** Preparar `.env.example` **somente** com URL e publishable key, portas de repositório tipadas e configurações sem credenciais; placeholders, não domínio de AG-07 ou banco de AG-08.
- **T02-04** Publicar `docs/ARCHITECTURE.md` com fronteiras e diferenciação das visões C4 conceituais antigas.
- **Aceite:** comandos reais e resultados de lint/build/test, inicialização e refresh de rota; handoff com paths modificados.

### AG-04 — UX, perguntas e estados (R2 para versão final)

- **T04-01** Antes do contrato, produzir apenas roteiro conceitual 7–8 telas e mapa de jornada A/B/C com pendências identificadas.
- **T04-02** Depois do G1, fechar sequência de perguntas, campos exatos, validações, estados `insufficient_data`, resultados com motivos, autorização e fluxo de AC/startup.
- **T04-03** Especificar loading/saving/saved/failed/retry/offline e avisos de simulação; navegação mobile/teclado; storyboard 2–3 minutos.
- **T04-04** Publicar `docs/UX_FLOW.md` + roteiro e aceite por tela; entregar handoff para AG-09/11.
- **Aceite:** nenhuma cópia sugere aprovação real ou IA generativa em tempo real; campos iguais ao DATA_MODEL.

### AG-05 — Catálogo fictício (R2; bloqueado por G1)

- **T05-01** Criar **3–5 startups fictícias e 4–6 soluções fictícias** conforme plano 07, em estrutura de dados aprovada (a meta mínima da ADR-001 era menor; divergência documentada em `DECISIONS.md`).
- **T05-02** Incluir EstoquePonte/ERP X, solução parcialmente condicional e registro não validado/expirado; requisitos explícitos e evidências sempre simuladas.
- **T05-03** Entregar `src/data/startups.ts`, `solutions.ts` ou JSON, matriz gate↔requisito e pelo menos 5 casos de elegibilidade.
- **Aceite:** B segue inelegível no catálogo criado; código/fichas não inventam validação comercial.

### AG-06 — Seeds e contraprovas (R2; bloqueado por G1/05)

- **T06-01** Criar quatro demandas sintéticas de **AC Alfa e AC Beta** com variantes sem ERP para o cluster de confirmação de estoque/WhatsApp; não confundir com caso A separado, que usa ERP X.
- **T06-02** Especificar cenários teste: A 90/100, B bloqueado sem score, C incompleto, D mesmo texto mas restrições/processo incompatíveis, E teto rígido inviável.
- **T06-03** Entregar `src/data/seed-demands.ts` e roteiro de nova demanda remota (quinta lógica), IDs estáveis e expectativa de contagem adaptativa.
- **Aceite:** dados sintéticos, coerentes com catálogo e AG-01; handoff para AG-07/09/10.

### AG-07 — Domínio determinístico (R3; bloqueado por G2)

- **T07-01** Implementar validação de necessidade e saída C; avaliar gates em ordem antes de score e registrar razões.
- **T07-02** Implementar score ponderado 30/20/20/15/15 e faixas PROPOSTAS; produzir breakdown/explicação e confiança separadas.
- **T07-03** Implementar briefing de B, heurística de similaridade com problema/processo/restrições/objetivo, cluster apenas sugerido à AC.
- **T07-04** Testes A=90 calculado; B sem ERP sem score; C; catálogo expirado; custo desconhecido; falso cluster; independência de ordem das fixtures.
- **Aceite:** funções puras, testes executados e logs de comando; `src/domain/`, `src/services/` e handoff.

### AG-08 — Persistência / RLS / proteção (R3; bloqueado G1/G1S/G2)

- **T08-01** Propor migração com constraints, RLS/GRANTs e sanitização, mapa de autorização por operação; submeter decisão de INSERT/SELECT e antispam sem relaxar segurança.
- **T08-02** Implementar `DemandRepository`, adaptadores Supabase/seeds/composite e `.env.example` seguro usando tipos do AG-01.
- **T08-03** Se houver autorização e ambiente, aplicar migração e **testar** INSERT qualificado, SELECT em outra sessão e negações de operações; registrar IDs sintéticos e comandos sem segredos.
- **T08-04** Documentar fallback e limites do free tier; guardar somente demanda final e não rascunhos do diálogo.
- **Aceite:** matriz de políticas validada e status remoto real. Se sem credenciais/segurança, entregar código e documento como **não implantado**.

### AG-09 — Frontend e integração (R3/R4)

- **T09-01** Com AG-02/03/04, montar páginas responsivas e componentes; mocks **tipados** e claramente temporários para serviços não concluídos.
- **T09-02** Integrar AG-07 sem alterar regra de domínio; A/B/C e narrativa detalhada, cards/briefing/cluster/AC/startup/FACESP.
- **T09-03** Integrar AG-08: estados remotos de verdade, dedupe, contador dinâmico, refresh, falha/retry, aviso de perfil simulado e reset apenas local.
- **T09-04** Entregar testes de componentes/fluxos, screenshots e README, comandos efetivamente executados; handoff para QA.
- **Aceite:** telas cobrem US-01–14 sem falsear sincronização ou decisões de papéis.

### AG-10 — Integração, QA, release (R4; bloqueado por 07/08/09)

- **T10-01** Executar lint/build/test e testes fim a fim A/B/C, gates/custo/curadoria, cluster, duas ACs, novo registro entre navegadores, erro de rede, deep links, mobile, teclado e ausência de PII/secrets.
- **T10-02** Verificar RLS/grants negativas; vetar deploy com risco alto de exposição ou INSERT público inseguro.
- **T10-03** Escrever `docs/QA_REPORT.md` com casos, resultados, evidências e defeitos; publicar em Cloudflare Pages **se houver autorização e acesso**, checar HTTPS/URL anônima e preparar backup.
- **T10-04** Registrar versão/tag ou commit sem alegar criação do que não executou; handoff real para AG-11/00.
- **Aceite:** provas objetivas; se Cloudflare inacessível, status **deploy não realizado**.

### AG-11 — Pitch e banca (provisório R1/R2, final R4)

- **T11-01** Preparar narrativa provisória de 3 min (5 min opcional) e arquitetura de 6–8 slides, perguntas da banca e plano B; distinguir demonstração da execução real.
- **T11-02** Após QA, substituir placeholders por cliques/prints e URL comprovados; enfatizar cenário A, B, benefício da rede e Supabase somente se de fato testado.
- **T11-03** Entregar fala final, roteiro de ensaio e limitações honestas; sem logotipos FACESP não autorizados e sem métricas de tração reais inexistentes.
- **Aceite:** roteiro reproduzível na versão homologada por AG-10.

## 4. Bloqueios e ações de desbloqueio

| Bloqueio | Impacto | Ação necessária | Quem resolve | Quem pode trabalhar enquanto isso |
| --- | --- | --- | --- | --- |
| **B-01 — contrato AG-01 inexistente ou não aprovado** | G1 e implementação final de 02/04/05/06/07/08/09 | AG-01 entrega contrato; equipe aprova; AG-00 registra versão e link | AG-01 + equipe | AG-03; AG-04/11 conceituais |
| **B-02 — política Supabase pública sem deliberação** | INSERT/SELECT remotos, RLS e risco de abuso | Deliberar Auth Anonymous/Turnstile ou solução efetiva, projeção SELECT e limites | Equipe + AG-08 | AG-01, AG-03, UX conceitual |
| **B-03 — repositório de código/ambiente não confirmado** | Scaffold, testes e deploy | Informar repo e permissões, espelhar arquivos canônicos em `docs/` | Equipe/AG-02 | ChatGPT docs e fixtures planejadas |
| **B-04 — instância/credenciais Supabase e Cloudflare não verificadas** | Teste remoto e URL | Criar ou disponibilizar projetos de demo; autenticação/autorização sem segredos em prompts | Equipe + AG-08/10 | Motor/UX local depois de G1 |
| **B-05 — aprovação de identidade/campos de comunicação pendentes** | Marca final/pitch/UI | Revisar AG-03/04 e aprovar alternativas visuais/microcopy | Equipe | Desenvolvimento por tokens provisórios marcados |

## 5. Checkpoint PMO e quadro de status inicial

| Frente | Status verificável | Próximo passo |
| --- | --- | --- |
| AG-00 | Baseline produzida; aprovação da equipe não comprovada | Validar publicações, recolher aprovação e manter changelog |
| AG-01 | **Liberado, sem entrega constatada** | Produzir `DATA_MODEL.md` e solicitar G1 |
| AG-03 | **Liberado, sem entrega constatada** | Produzir `BRAND_SYSTEM.md` |
| AG-04 | **Liberado só para blueprint conceitual** | Esboçar, aguardar G1 para campos finais |
| AG-11 | **Liberado só para pitch provisório** | Narrativa condicionada a telas/QA reais |
| AG-02/05/06/07/08/09/10 | **Bloqueados por dependências** | Aguardar gates na ordem descrita |

**Cadência sugerida:** registrar handoff no encerramento de cada execução de agente; AG-00 atualiza quadro, riscos, bloqueios e decisões após cada handoff; revisar gates antes de disparar agentes Cursor e imediatamente antes do pitch. Tempo/calendário real de implementação não é assumido neste plano.
