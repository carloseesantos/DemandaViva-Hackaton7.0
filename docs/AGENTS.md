# DEMANDA VIVA — AGENTS


## CHECKPOINT DE AGENTES 1.3.0 — AG-02/04/05 aceitos para integração — 14/11/2026


**Verificação documental e técnica:** [commit 31481ad](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/31481ad9b1e25b44e0b03b225a4794c3ea1d416a), [ZIP main atualizado](https://drive.google.com/file/d/1OslrqHYazOEYfNrpl_o42f6HUvud5UMI/view) e capturas do `npm run check` (36 testes, ESLint, build e verificação SPA aprovados). Os hashes SHA Git de caminhos críticos no ZIP conferem com o commit. **Não houve CI independente, deploy nem teste remoto de banco.**


| Agente | Estado atual (substitui snapshots antigos) | Dependência efetivamente liberada |
|---|---|---|
| AG-01 | Concluído/contrato aprovado G1 | Tipos canônicos permanentes. |
| AG-02 | Concluído e **aceito para scaffold** | Infraestrutura React/TS/Vite, DI, lint, testes e build. |
| AG-03 | Concluído/direção Ponte Viva aprovada | Tokens/brand para UI/pitch. |
| AG-04 | Concluído **documentalmente, aceito para implementação UX** | `docs/UX_FLOW.md`, handoff e Mermaid; **AG-09 liberado para telas e mocks**. Sem teste observacional. |
| AG-05 | Catálogo e documentação **aceitos para consumo técnico** | `src/data/startups.ts`, `solutions.ts`, `evidences.ts`, `catalog-enums.ts`, teste de referência AG-05; **AG-06 liberado para seeds finais**. |
| AG-06 | **Liberado para execução completa** | Criar 4 seeds sem ERP de 2 ACs e fixtures A/C/D/E após contrato/catalogo; não supor execução concluída. |
| AG-07 | Bloqueado por AG-06 | Iniciar somente após handoff de fixtures; testes atuais não são do motor real. |
| AG-08 | Liberado para projeto de segurança G1S e camadas locais seguras | Proibir INSERT/SELECT remoto público antes de aprovação e testes RLS/GRANTs/antiabuso. |
| AG-09 | Liberado para implementar frontend com mocks tipados | Integração AG-07/08 permanece posterior a handoffs. |
| AG-10 | Bloqueado pela integração AG-07/08/09 | QA real, deploy e smoke ainda não feitos. |
| AG-11 | Pitch provisório liberado; final depende AG-10 | Não afirmar URL, uso real ou aprovação oficial. |


**Git hygiene:** `.cursor/` e `.wrangler/` aparecem como untracked no status enviado pela equipe, sem arquivos rastreados modificados. Não commitar automaticamente. A `.gitignore` já está no repositório, mas não inclui os dois; equipe decide tratamento de `.cursor/`, e `.wrangler/` deve permanecer local.






## CHECKPOINT DE AGENTES 1.2.0 — Snapshot Git `ee7b426` (14/11/2026)




**AG-02**: scaffold publicado em [main](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/ee7b426e816c8827755328587721ec21b7272f04) e handoff em [Drive](https://drive.google.com/file/d/1oIwvj_VI25w6I_QjzuV9x8NFMDXzdndp/view). Handoff afirma lint/31 testes/build e deep-link 200 no emulador; testes independentes não completados (Node local incompatível e cache npm offline insuficiente). Ausentes do Git/ZIP apesar do handoff: `.env.example`, `.gitignore`, `.node-version`; AG-02 deve publicar correção. **Estado: entrega documental e commit verificados; aceite técnico condicionado à correção.**




**AG-04 / AG-05**: equipe informa execução em chats, porém não há `docs/UX_FLOW.md`, `src/data/startups.ts`, `solutions.ts`, `evidences.ts` ou handoffs correspondentes na `main` auditada. **Estado: submissão/validação pendentes**, sem aprovação tácita. Destinos: AG-04 `docs/UX_FLOW.md` + `docs/ux/`; AG-05 `src/data/` + `docs/catalog/`. Não substituir tipos AG-01.




**Liberação de trabalho:** AG-06 planejamento (fixação após AG-05 aceito); AG-08 desenho de G1S (sem acesso público); AG-11 pitch provisório. AG-09 somente após UX AG-04 verificada (com mocks); AG-07 após AG-06; AG-10 após AG-07/08/09. **G2 parcial, G1S crítico pendente.** Dados remotos, testes Cloudflare públicos e P0 continuam não evidenciados. O quadro abaixo é histórico da baseline anterior.












> **Baseline:** 1.3.0 — 2026-11-14 \| **Coordenação:** AG-00 \| **Total:** 12 agentes (`AG-00` a `AG-11`). **Regra de estado:** “Liberado” significa **autorizado a iniciar**, não “em andamento”; ausência de handoff não autoriza marcar trabalho como concluído.








## CHECKPOINT AGENTES — 14/11/2026 — v1.1.0








**Aprovações informadas pela equipe:** contrato [DATA_MODEL.md v1.0.0](https://drive.google.com/file/d/1vNF2QbKs30x9aNeGqGpCz-txru4OxnaQ/view) do AG-01 **aprovado**; direção 01 Ponte Viva do AG-03 **selecionada**, conforme [BRAND_SYSTEM.md](https://drive.google.com/file/d/1TYfIBbUIDPgJfAGFDYDKuGduzYxSJJaJ/view) e [pacote visual](https://drive.google.com/drive/folders/1xy3wChZPRtt7XYr2YZRauVE3IVwOjRUs). Não há validação de código, SQL, deploy ou SPA integrada.








| Agente | Status atual | Obrigação para consumidor |
|---|---|---|
| AG-00 | PMO ativo; atualizar documentação/checkpoints | Preservar decisões, verificar evidências e aprovar somente gates documentados. |
| AG-01 | **Concluído / G1 aprovado (especificação)** | Contrato canônico congelado v1.0.0; alterações via registro de decisão. Não executou migration/TS compilado. |
| AG-03 | **Concluído / visual Ponte Viva aprovado** | Tokens, logo, componente, contraste entregues; testes UI reais continuam com AG-09/10. |
| AG-02 | **Liberado para iniciar** | Verificar repositório, git status e espelhar docs G1 antes de scaffold. |
| AG-04 | **Liberado para UX definitiva** | Usar tipos/códigos do AG-01 e identidade visual aprovada; não inventar campos livres. |
| AG-05 | **Liberado para catálogo sintético** | Consumir tipos AG-01; EstoquePonte com ERP X, B inelegível; evidências rotuladas. |
| AG-06 | **Planejamento liberado, fixtures finais dependem AG-05** | Quatro seeds B sem ERP, 2 ACs, caso A separado, D/E contraprovas. |
| AG-08 | **Parecer G1S liberado; implementação remota depende decisão + scaffold** | Não abrir policies/RPC públicos antes de G1S; RLS/grants/antiabuso. |
| AG-11 | **Pitch provisório liberado** | Usar Ponte Viva; apresentação final espera telas/deploy testados. |
| AG-07, AG-09, AG-10 | **Aguardando outros gates** | AG-07: 02/05/06; AG-09: 02/04 + mocks e integração posterior; AG-10: integração 07/08/09. |








**Nota de leitura:** a matriz de estados da baseline 1.0.0 abaixo permanece como referência histórica de responsabilidades e ownership. Qualquer rótulo 'bloqueado por AG-01' nela foi superado por G1; as outras dependências continuam válidas. Não editar arquivos de outro agente sem acordo; o AG-00 não altera o material-fonte entregue pelo AG-01 ou AG-03 retroativamente.








## 1\. Governança e hierarquia








- **Equipe do hackathon:** autoridade final sobre mudanças de produto, arquitetura, segurança, pesos/faixas, escopo e apresentação pública. O PMO recomenda, organiza, registra conflitos e solicita aprovação; não decide unilateralmente.  
- **AG-00 PMO:** guarda do escopo, do registro de decisões e das interfaces entre agentes; controla gates, risco, dependências, versões e evidências. Pode bloquear integração não conforme; não reescreve decisões aprovadas.  
- **AG-01 arquiteto de dados:** autor do contrato único de entidades/TS/códigos/schema, **submetido à aprovação da equipe**. Não implementa produto nem cria banco remoto sem autorização.  
- **Agentes executores:** cada um altera apenas seus arquivos e serviços de responsabilidade, usando contratos aprovados; mudanças de contrato geram proposta ao AG-00. Outros agentes não reabrem decisões implicitamente.








**Invariantes compartilhadas:** React/TS/Vite \+ Cloudflare Pages; seeds e catálogo fictícios locais; somente novas demandas qualificadas remotas via Supabase; filtros antes do score; cenário A \= 90/100 calculado e cenário B inelegível sem score; resultado C distinto; dados exclusivamente sintéticos; troca de perfil ≠ autenticação; nenhuma geração automática de software; handoff sempre baseado em evidências; ADR-002 prevalece sobre ADR-001 somente para persistência.








## 2\. Matriz de agentes, limites e entregas








| ID | Ambiente e responsabilidade | Entregáveis / propriedade primária | Entradas e dependências | Limites e situação inicial |
| :---- | :---- | :---- | :---- | :---- |
| **AG-00** | **ChatGPT / PMO**, orquestra backlog, gates, riscos e decisões | `docs/PROJECT_CONTEXT.md`, `AGENTS.md`, `BACKLOG.md`, `TASKS.md`, `DECISIONS.md`, `HANDOFF_AND_RISKS.md`; quadro de status | 00–07; handoffs de todos | Não escreve o código de outros agentes. **Governança inicial documentada; revisão e sincronização com repositório pendentes.** |
| **AG-01** | **ChatGPT / Arquiteto de dados e contratos** | `docs/DATA_MODEL.md`, tipos/discriminated unions, DDL proposto, modelo `Need/Requirement/...`, mapeamento TS↔SQL, testes JSON A/B/C | Fontes 01/02/03, ADR-002, contexto PMO | Não altera regras de negócio nem cria tabelas reais. **Liberado para iniciar; contrato ainda não evidenciado/aprovado.** |
| **AG-02** | **Cursor / Arquiteto técnico e scaffold** | `docs/ARCHITECTURE.md`, Vite React/TS, rotas placeholder, pastas, scripts lint/build/test, `.env.example`, README | AG-01 aprovado \+ contexto/decisões \+ acesso ao repo | Não implementa matching nem banco. **Bloqueado pelo contrato AG-01 e repositório não evidenciado.** |
| **AG-03** | **ChatGPT / Marca e design system** | `docs/BRAND_SYSTEM.md`, paleta/tokens, logo, variações, componentes e uso | Documento 00 \+ slides 04 | Não renomeia DEMANDA VIVA ou presume autorização para logo FACESP. **Liberado para iniciar em paralelo.** |
| **AG-04** | **ChatGPT / UX conversacional e blueprint** | `docs/UX_FLOW.md`, service blueprint, rotas, 7–8 telas, microcopy, estados de rede, wireframes | Fontes 01–03 e **AG-01 aprovado para campos finais** | Sem implementar frontend/IA. **Conceito permitido agora; especificação final bloqueada pelo AG-01.** |
| **AG-05** | **ChatGPT / Catálogo sintético** | `src/data/startups.ts`, `src/data/solutions.ts` ou JSON tipado, matriz de elegibilidade, fichas e testes de fixtures | AG-01 aprovado | Só fictícios, evidências simuladas. Não cria solução que faça B elegível por acidente. **Bloqueado.** |
| **AG-06** | **ChatGPT / Demandas sintéticas e cenários** | `src/data/seed-demands.ts`, 4 seeds / 2 ACs, testes A–E, roteiro da nova quinta demanda | AG-01 aprovado \+ compatibilização com AG-05 | Dados sintéticos, IDS estáveis; não fixa contagem remota. **Bloqueado.** |
| **AG-07** | **Cursor / Domínio de matching, briefing e clusters** | `src/domain/`, `src/services/`, testes unitários e explicação da heurística | AG-01/02/05/06 e fontes 02/03 | Não muda UX nem Supabase; filtros primeiro, score só para elegíveis. **Bloqueado.** |
| **AG-08** | **Cursor / Supabase, repositórios e segurança** | `supabase/migrations/`, `src/repositories/`, RLS/GRANTs, mapeamentos e testes de política | AG-01/02; decisão de escrita/leitura pública segura | Não expõe service\_role, não cria API Node ou política permissiva para cumprir prazo. **Bloqueado.** |
| **AG-09** | **Cursor / Frontend e integração** | `src/pages/`, `src/features/`, `src/components/`, `src/styles/`, UI/fluxos A/B/C e estados remotos | AG-02/03/04, AG-01; mocks tipados de 07/08 até integração | Não redefine motor/SQL; não chama login simulado de autenticação. **Bloqueado até scaffold e contratos; UI com mocks depois.** |
| **AG-10** | **Cursor / QA, segurança, release, deploy** | `docs/QA_REPORT.md`, testes integrados, smoke, release checklist, publicação Pages (se autorizada) | AG-07/08/09 e acesso à hospedagem | Sem desligar RLS para liberar demo; sem declarar link/teste sem evidência. **Bloqueado.** |
| **AG-11** | **ChatGPT / Pitch e demo** | Roteiro 3 min/5 min, 6–8 slides, perguntas da banca, plano B e fala | Documentos 00–04, AG-04 conceitual; final após AG-10 | Sem inventar URL, tração ou parcerias. **Rascunho conceitual permitido; final bloqueado pelo QA.** |








**Propriedade de arquivos:** a matriz acima define donos primários; colaboração deve ocorrer via contrato, mock tipado e HANDOFF. Alterar arquivo de outro agente exige acordo explícito de escopo e registro em `DECISIONS.md` quando afetar regra ou arquitetura.








## 3\. Regras de acionamento e concorrência








**Rodada 1 (imediata):** AG-00 consolida governança; **AG-01** elabora contrato; **AG-03** elabora identidade. AG-04 e AG-11 podem produzir **propostas conceituais não finais**, desde que ressaltem campos/links pendentes.








**Gate de aprovação de AG-01:** PMO verifica `DATA_MODEL.md` com entidades, campos obrigatórios, códigos, enums, critérios de validação, esquema SQL mapeado, exemplos A/B/C, merge/dedupe, política de versionamento e status das decisões de segurança. O material deve receber **aprovação explícita da equipe** antes da geração definitiva de fixtures e do desenvolvimento sobre o contrato.








**Rodada 2 (depois do gate):** AG-02 (scaffold), AG-04 (UX definitiva), AG-05 (catálogo) e AG-06 (seeds) trabalham em paralelo; 05/06 alinham IDs e casos A/B/C; AG-08 pode antecipar **desenho de segurança** com AG-01, mas não libera endpoint público até decisão testada.








**Rodada 3:** AG-07 (motor) depende de 01/02/05/06; AG-08 (persistência) depende de 01/02 \+ política de segurança; AG-09 inicia composição de UI com 02/03/04 e **mocks tipados**, integrando 07/08 após HANDOFFs.








**Rodada 4:** AG-10 executa QA fim a fim e deploy, com handoff de 07/08/09; AG-11 finaliza pitch apenas depois das evidências de QA e do URL comprovado. O PMO controla a liberação dos gates de integração.








## 4\. Contratos entre agentes








- **AG-01 → 02/04/05/06/07/08/09:** entidades com versionamento e estados discriminados (`qualified`, `insufficient_data`, `ineligible`), campos controlados, contratos do repositório, adaptação banco/API e exemplos de ida e volta.  
- **AG-03 → 09/11:** logo/tokens, tipografia acessível, comportamento mobile e textos de marca aprováveis; visual não define novos requisitos de dados.  
- **AG-04 → 09/11:** rotas, tela a tela, validações, comunicação de B e C, loading/error/retry, distinção `local` vs `cloud`, narrativa de 2–3 minutos.  
- **AG-05 \+ 06 → 07/09/10:** fixtures coerentes, IDs estáveis, catálogo e casos A/B/C, casos de fronteira, resultados esperados para testes sem hardcode.  
- **AG-07 → 09/10:** API de serviço tipada, motivos de gates/score, explicações de cluster, testes determinísticos; não apresenta APROVAÇÃO AC como automação real.  
- **AG-08 → 09/10:** repositório tipado, schema/migrations/RLS, contrato de estados remoto e testes de leitura/escrita/negação; erros devem ser exibíveis sem mentir ao usuário.  
- **AG-09 → 10/11:** rotas navegáveis e screenshots de A/B/C, estados de conexão e ciclo AC/startup, comandos e scripts que rodam localmente.  
- **AG-10 → 11/00:** relatório de testes efetivamente executados, regressões, liberação ou veto do deploy, URL real validado, commit/versão e plano de contingência.








## 5\. Handoff, qualidade e impedimentos








Todo agente deve entregar o formulário de `HANDOFF_AND_RISKS.md` com: estado real, escopo, fontes lidas, **arquivos concretos**, testes e resultados, decisão pendente, riscos, dependências liberadas e próximos passos. Agente Cursor inspeciona **docs/, package.json, src/ e git status** antes de modificar o workspace; não alega acesso a Drive se apenas recebeu links. Agente ChatGPT entrega documentos completos; não afirma que editou repositório inacessível.








Nenhuma etapa é “concluída” por uma intenção ou entrega parcial sem evidência. **Bloqueios estruturais atuais:** contrato AG-01 não aprovado; repositório de código não confirmado; política de INSERT/SELECT público \+ proteção antiabuso Supabase não deliberada; projeto Supabase e deploy não comprovados. Registros detalhados em `DECISIONS.md`, `TASKS.md` e `HANDOFF_AND_RISKS.md`.








## 6\. Fontes








O conjunto oficial de referência nesta execução é o [Drive DEMANDA VIVA](https://drive.google.com/drive/folders/1C1e7pMC8GfYAY164I_u4OKiGmUwYXXh7), especialmente [07 — Plano de agentes](https://docs.google.com/document/d/1v9DjGvdYMEfphBo36xzvCPIGYN1AFp47QjCACCF1pbY/edit) e [06 — ADR-002](https://docs.google.com/document/d/1vO34lMSNB95qUw5cjZLHje2WDyHb9XMkOaLNl1ZS0jM/edit). As responsabilidades e rounds aqui consolidam as propostas originais, sem alterar decisões aprovadas.