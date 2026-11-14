# DEMANDA VIVA — BACKLOG P0/P1


## CHECKPOINT DO BACKLOG 1.3.0 — atualização de evidências (14/11/2026)


[Commit 31481ad](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/31481ad9b1e25b44e0b03b225a4794c3ea1d416a) contém AG-04 (`docs/UX_FLOW.md` + Mermaid/handoff), AG-05 (4 startups/5 soluções fictícias, 5 testes de referência e notas de curadoria) e scaffold AG-02 com configuração corrigida. Capturas mostram `npm run check` com 36/36 testes, lint e build aprovados, `verify-spa-build: OK`. ZIP do Drive atualizado confere por hashes Git de cinco arquivos. **Esses testes não implementam o motor AG-07 nem validam operação Supabase ou telas definitivas.**


**US-04**: catálogo estático versionado e com testes de referência; **aceite documental/técnico para consumo por AG-06/07**, mas QA integrado e curadoria real não ocorreram. **US-01, US-02, US-03, US-09, US-14**: especificação UX disponível, **implementação AG-09 pendente**. **US-05 a US-08**: AG-07/06 ainda pendentes; resultados A/B/C do test runner são apenas referência. **US-10 a US-13**: bloqueadas em G1S/AG-08. **US-15/US-16**: aguardam testes/deploy/roteiro final; não fechar histórias só com documentação.


**Liberações:** AG-06 para fixtures finais; AG-09 para interface com mocks após AG-04; AG-08 para parecer G1S. **G2 parcial até seeds AG-06**; G3–G6 não concluídos. Critérios de aceite P0/P1 preservados.






## CHECKPOINT DO BACKLOG 1.2.0 — AG-02; AG-04/05 ainda sem artefato publicado no Git




**Scaffold versionado:** [Git main ee7b426](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/ee7b426e816c8827755328587721ec21b7272f04) contém base React/TS/Vite, placeholder routes e estrutura definida. Handoff do AG-02 informa 31 testes, lint, build e validação local Wrangler; não há CI remoto nem deploy público evidenciados. Arquivos `.env.example`, `.gitignore`, `.node-version` não aparecem na árvore versionada e exigem correção/handoff. Nenhuma US P0/P1 está **homologada** apenas por scaffold.




**Pendência documental:** execução AG-04/05 foi informada pela equipe, mas `docs/UX_FLOW.md`, `src/data/startups.ts`, `solutions.ts`, `evidences.ts` e handoffs não se encontram no snapshot Git inspecionado. US-01 a US-03 e US-09/14 dependem de UX AG-04; US-04/05/06/07 e AG-06 dependem de catálogo AG-05. Catalogar US-04 como **pendente de evidência**, não concluída.




**Próximo fluxo:** publicar AG-04/AG-05 e checar modelos; então AG-06 finaliza quatro seeds e testes A–E, AG-07 implementa gates/score/briefing/cluster e AG-09 cria UI a partir de UX; AG-08 prepara segurança G1S e repositórios, sem expor endpoint até decisões e testes. G2 parcial; G3–G6 ainda não alcançados. Regras e critérios de aceite anteriores mantidos integralmente.












> **Versão:** 1.2.0 | **Data:** 2026-11-14 | **Dono:** AG-00 | **Estado:** planejamento; histórias não são evidência de implementação.
> Prioridades: **P0** = demonstração, integridade e segurança essenciais; **P1** = ampliação pós-P0. Dep.: `AG-nn` representa handoff do agente, não sua simples convocação. Os testes de aceite precisam de evidência de AG-10.








## CHECKPOINT DE DEPENDÊNCIAS DO BACKLOG — 14/11/2026 — v1.1.0








**Gate G1 aprovado pela equipe:** [DATA_MODEL.md v1.0.0](https://drive.google.com/file/d/1vNF2QbKs30x9aNeGqGpCz-txru4OxnaQ/view) é contrato de `QualifiedNeed`, `NeedDraft`, requisitos/códigos, A/B/C, persistência final, seeds/IDs, merge e testes. [Direção 01 Ponte Viva](https://drive.google.com/file/d/1TYfIBbUIDPgJfAGFDYDKuGduzYxSJJaJ/view) escolhida para identidade visual; tokens/guia disponíveis. Os critérios de aceite e prioridades das 16 histórias P0/6 P1 **não foram modificados nem marcados concluídos**: aprovação documental não é produto implementado.








**Impacto direto no backlog:** US-01 recebe a identidade aprovada, mas a interface ainda não existe; US-02/03/10 devem serializar somente `QualifiedNeed` confirmada (C fica `NeedDraft` local); US-04/05/06/07 preservam seis gates e score apenas elegível, A 90 calculado, B sem score; US-08/11 usam quatro seeds B sem ERP + remotos com dedupe, contagem dinâmica; US-10/11/12/13 continuam bloqueadas para teste remoto público até segurança G1S deliberada/implementada; US-15/16 dependem QA/deploy. O contrato de dados aprovado não altera a natureza demonstrativa das ações de AC/startup.








**Trabalho liberado:** AG-02 scaffold (após verificar repo), AG-04 UX, AG-05 catálogo; AG-06 planejamento e dados definitivos após AG-05. AG-08 pode produzir parecer G1S. A seção 5 da baseline 1.0.0 reflete o status **anterior** às aprovações. Só marcar US concluída com artefato implementado e evidências de teste/handoff verificadas.








## 1. Definição transversal de aceitação








Uma história só está **concluída** quando o dono fornece código/documento concreto e teste ou validação executada com resultado, além de handoff aceito pelo PMO. Nenhuma história pode alegar dados reais, startup efetivamente validada, aprovação real da AC, parceria oficial FACESP, geração automática de software ou sucesso remoto não confirmado. Formulários/fixtures são sintéticos, rotulados como demonstração. Para motor e repositórios, aceitar apenas estruturas do **AG-01 aprovado**.








## 2. P0 — produto, dados e jornadas








### US-01 — Entrar na demonstração e entender a proposta








**Como** visitante da banca, **quero** escolher a perspectiva de lojista, AC, startup ou FACESP **para** percorrer a rede sem login.








**Aceite:** (a) marca “DEMANDA VIVA”, com DEMANDA predominante; (b) aviso visível de dados e decisões fictícios; (c) alternância de perspectiva não afirma autenticação, autorização ou multiusuário real; (d) SPA funciona em mobile e desktop; (e) rota inicial e rotas internas navegáveis. **Donos:** AG-03/04/09. **Dep.:** AG-02, marca AG-03, UX AG-04.








### US-02 — Relatar uma dor concreta em entrevista estruturada








**Como** lojista fictício, **quero** registrar meu problema operacional **para** obter requisitos verificáveis.








**Aceite:** perguntas de ocorrência, processo, frequência, canal, sistemas/ERP, integração, requisitos, orçamento, restrições, indicador/linha de base/meta; identificação de AC fictícia; campos obrigatórios destacados e validação por etapa; nenhum dado pessoal verdadeiro solicitado. **Donos:** AG-01/04/09. **Dep.:** contrato AG-01, blueprint AG-04, scaffold AG-02.








### US-03 — Confirmar ou complementar o diagnóstico (resultado C)








**Como** lojista fictício, **quero** revisar um resumo com fatos, hipóteses e lacunas **para** confirmar antes de receber encaminhamento.








**Aceite:** confirmação é explícita; sem campos mínimos = `Dados insuficientes` e perguntas específicas; não gera resultado B, pontuação, briefing final nem `insert` remoto; após complemento, motor reavalia. **Donos:** AG-04/07/09. **Dep.:** AG-01/02/04/07.








### US-04 — Disponibilizar catálogo fictício curado e rastreável








**Como** gestor de demonstração, **quero** consultar soluções com requisitos e validade **para** aplicar elegibilidade reproduzível.








**Aceite:** catálogo estático com IDs estáveis, funções, integrações obrigatórias, custo simulado/unknown, território, maturidade e evidências claramente **simuladas**; ficha expirada/não validada não vira indicação confirmada; incluir EstoquePonte dependente de ERP X; nenhuma alegação falsa sobre startups reais. **Donos:** AG-05. **Dep.:** contrato AG-01, alinhamento AG-06.








### US-05 — Aplicar filtros eliminatórios antes do score








**Como** AC, **quero** rejeitar candidatas incompatíveis **para** evitar falso match.








**Aceite:** função essencial, sistemas/integrações/hardware, teto rígido, privacidade/dados, território/porte/canal e evidência/validade avaliados ANTES de pontuar; motivos e evidências registrados; reprovação não recebe score; preço desconhecido não é substituído por estimativa inventada. **Donos:** AG-07. **Dep.:** AG-01/02/05/06.








### US-06 — Mostrar match explicável para cenário A








**Como** lojista, **quero** entender o resultado e as condições da compatibilidade **para** decidir sobre demonstração ou piloto.








**Aceite:** papelaria com ERP X + EstoquePonte fictícia passa nos gates; notas 5/5/4/4/4 em pesos 30/20/20/15/15 produzem **90/100 por cálculo**, com breakdown, limitações, confiança/evidências e aprovação da AC indicada como **simulada**; critérios/faixas são rotulados como proposta da equipe. **Donos:** AG-07/09. **Dep.:** AG-05/06/07, UX AG-04.








### US-07 — Exibir cenário B sem falso match e gerar briefing








**Como** lojista sem ERP, **quero** uma explicação e uma demanda aproveitável **para** continuar o atendimento sem indicação inadequada.








**Aceite:** EstoquePonte reprovada por exigir ERP X e **sem pontuação**; texto “sem solução elegível no catálogo consultado” (não no mercado); briefing com problema observável, processo, contexto técnico, requisitos, restrições, indicador, lacunas e perguntas; revisão/autorização AC simulada explícita; dados insuficientes seguem US-03. **Donos:** AG-07/09. **Dep.:** AG-01/04/05/06/07.








### US-08 — Agrupar demandas comparáveis sem fundir diferenças








**Como** AC, **quero** localizar padrões entre relatos **para** avaliar uma oportunidade coletiva.








**Aceite:** quatro demandas seed fictícias (L-001..L-004 ou IDs estáveis acordados) de **AC Alfa e AC Beta**; comparar problema, etapa/processo, restrições e resultado esperado, não apenas texto; preservar diferenças por lojista; impedir agrupamento quando a mesma frase descrever processo incompatível; cluster proposto sujeito a revisão humana. **Donos:** AG-06/07/09. **Dep.:** AG-01/06/07.








### US-09 — Demonstrar mediação AC, chamada e resposta da startup








**Como** AC e startup fictícias, **quero** ver o briefing consolidado, a chamada e as respostas **para** compreender a inovação aberta.








**Aceite:** AC pode revisar cluster e autorizar **simuladamente** chamada com escopo/critério de resposta; startup responde com esclarecimentos, proposta de adaptação ou piloto ou recusa; não há fabricação automática de software, aceite real ou cadastro remoto dessas ações; dados compartilhados são sintéticos/minimizados. **Donos:** AG-04/07/09. **Dep.:** AG-03/04/07/09.








### US-10 — Salvar somente uma nova demanda qualificada no Supabase








**Como** lojista fictício, **quero** confirmar minha ficha e registrá-la **para** disponibilizá-la a outra sessão da demonstração.








**Aceite:** após confirmação e qualificação, `DemandRepository.save` executa INSERT real em `public.demo_demands` sob RLS; retorno remoto inclui ID estável; mensagem “salvo na nuvem” **apenas após confirmação**; rascunhos, histórico integral de chat e seeds não são gravados; erro mantém estado local claramente não sincronizado. **Donos:** AG-01/08/09. **Dep.:** AG-01/02/08, decisões de segurança SEC-01/02.








### US-11 — Atualizar painel da AC em outro navegador








**Como** AC em sessão separada, **quero** consultar novas demandas e combiná-las às seeds **para** visualizar recorrência viva.








**Aceite:** SELECT autorizado traz somente registros sintéticos de demonstração; merge/dedupe por ID estável com 4 seeds; “Atualizar demandas” refaz clusters; segunda janela anônima exibe registro remoto criado, identificado por ID; contagem reflete dados existentes e **não é fixada em 5**. **Donos:** AG-08/09/10. **Dep.:** AG-06/07/08/09, política de SELECT.








### US-12 — Assegurar banco e uso público demonstrativo








**Como** equipe, **quero** publicar um MVP sem expor dados ou credenciais **para** reduzir riscos de demonstração.








**Aceite:** migração SQL versionada com UUID, constraints e `is_demo=true`; grants e RLS auditados; escrita conforme política de autenticação/antiabuso deliberada; permissões negativas testadas (UPDATE/DELETE negados, INSERT indevido negado); bundle sem secret/service_role; dados exclusivamente sintéticos e projeção de leitura minimizada; limite da “AC” visual explicado. **Donos:** AG-08/10. **Dep.:** AG-01, SEC-01/02/03, ambiente Supabase disponível.








### US-13 — Preservar a demo quando Supabase falhar








**Como** apresentador, **quero** visualizar seeds e matches offline **para** não interromper toda a demonstração.








**Aceite:** SPA/seed/motor local continuam; estado “modo offline”, “não sincronizado”, retry e ação consciente de ressincronização; nenhum falso sucesso; botão “Reiniciar demonstração” limpa estado local sem DELETE remoto. **Donos:** AG-08/09/10. **Dep.:** AG-02/08/09.








### US-14 — Apresentar visão agregada FACESP








**Como** visitante na perspectiva FACESP, **quero** ver temas e volume agregados **para** compreender o benefício da rede.








**Aceite:** contagem derivada de registros sintéticos ou identificada como exemplo, sem atribuição a dados reais FACESP; nenhuma exposição de identificação pessoal; UI não simula autorização real. **Donos:** AG-04/09. **Dep.:** AG-01/06/09.








### US-15 — Publicar e demonstrar release verificável








**Como** banca, **quero** abrir uma URL HTTPS funcional **para** percorrer A, B e persistência entre sessões.








**Aceite:** lint/build/test executados e relatório; smoke com A/B/C, segurança e rede, mobile/teclado, refresh de rota profunda, segunda AC, cenário sem Supabase; URL real do Cloudflare Pages verificada em janela anônima; versão/commit rastreado, plano B disponível. Se conta/rede indisponível, **não declarar esta história concluída**. **Donos:** AG-10. **Dep.:** AG-07/08/09, infraestrutura e credenciais autorizadas.








### US-16 — Comunicar pitch fiel ao que foi construído








**Como** apresentador, **quero** uma narrativa de 3 minutos **para** demonstrar problema, A, B e a rede.








**Aceite:** pitch distingue regras propostas, fixtures e operações realmente testadas; roteiro de cliques conforme release AG-10; Plano B de rede; não cita tração/validação real inexistente, logotipo FACESP não autorizado ou URL não verificada. **Donos:** AG-11. **Dep.:** AG-03/04; final AG-10.








## 3. P1 — após estabilização dos fluxos P0








| ID | História / benefício | Critérios de aceite propostos | Dep. / dono |
| --- | --- | --- | --- |
| **US-17** | Reproduzir histórico integral da conversa | Mensagens opcionais versionadas, retenção/privacidade revisadas, consentimento e testes; jamais requisito P0 de `demo_demands` | Decisão equipe; AG-01/08/09 |
| **US-18** | Autenticação real e perfis de AC/startup | Controle por identidade, segregação de dados e testes de acesso cruzado; descontinuar role switcher como mecanismo de controle | Novo ADR; AG-01/08/09 |
| **US-19** | Persistir aprovações, chamadas e respostas | Workflow e auditoria remota com autorização, estados e trilha; não manter decisões ficcionais como fatos reais | Governança; AG-01/08/09 |
| **US-20** | Analytics e qualidade do piloto | Metas e resultados verificáveis, agregação por AC/regional sem identificação pessoal e fonte de dados declarada | AG-01/09/10 |
| **US-21** | Integrações e catálogo real sob curadoria | Entrada de evidências, vigência, revisão humana, LGPD e relacionamento formal com startups | Novo escopo/ADR; equipe + agentes |
| **US-22** | Notificações e monitoramento operacional | Mensagens externas somente com consentimento, provedores autorizados, segurança e rastreabilidade | Novo ADR; equipe + agentes |








## 4. Rastreabilidade de resultados-chave








| Caso | Evidência esperada | História | Agente validador |
| --- | --- | --- | --- |
| A — ERP X, 90/100 | Fixture tipada + teste unitário de cálculo + captura da tela | 04–06 | AG-07/10 |
| B — sem ERP, bloqueio sem score | Teste de gate e UI, briefing gerado | 05,07 | AG-07/10 |
| C — diagnóstico incompleto | Teste de validação com próximos campos | 02,03 | AG-07/10 |
| D — cluster não falso | Seeds/contraprova e teste determinístico | 08 | AG-07/10 |
| E — quinta demanda remota em outra sessão | log de INSERT e SELECT, IDs, contagem derivada | 10,11 | AG-08/10 |
| F — rede indisponível | teste negativo e UI sem falsa sincronização | 13 | AG-08/09/10 |
| G — segurança remota | SQL/RLS/grants e testes negativos (sem secrets) | 12 | AG-08/10 |
| H — deploy | relatório build/smoke e URL real | 15 | AG-10 |








## 5. Situação em 14/11/2026








**Status de implementação:** nenhuma história P0/P1 está comprovada como concluída pelos documentos inspecionados. O backlog registra trabalho **planejado**. Antes de começar histórias que geram fixtures/TS/SQL, equipe precisa aprovar o contrato AG-01; antes de aceitar US-10/11/12, deliberar a estratégia de acesso público e comprovar RLS/antiabuso. O quadro de execução e os riscos estão em `TASKS.md` e `HANDOFF_AND_RISKS.md`.