# HANDOFF — AG-04 DEMANDA VIVA | v1.0 | 14/11/2026

## Status e fontes
- UX_FLOW.md concluído e fundamentado nos Docs 00–03, ADR-002, AG-01 DATA_MODEL.md (contrato G1 aprovado segundo PMO v1.1), AG-03 Ponte Viva (direção aprovada) e registros AG-00.
- Não foi realizado teste observacional com usuários, implementação da SPA, publicação, migração SQL ou teste de RLS. G1S permanece pendente.

## Resumo da entrega
- 8 templates de tela: entrada, entrevista em 5 etapas, confirmação, A, B/C, AC, startup, FACESP.
- Perguntas exatas (22 itens), service blueprint, fluxograma Mermaid, rotas, validação, microcopy, estados de rede/erro/retry, UX mobile/a11y e roteiro de 2m40s.
- Fluxos A/B/C e exceções `conditional`, `no_recommendation`, `insufficient_data` distintos.

## Para AG-09
1. Consumir exclusivamente tipos/enums/registries do AG-01 aprovado; os textos em português são labels de UI, não novos enums.
2. Entrevista com passo de revisão; `InterviewEphemeral` visual local não persistível; `NeedDraft` só local; `QualifiedNeed` final e sintético é a única unidade de escrita.
3. Depois de seis gates `pass`, renderizar score do AG-07. Não renderizar score para `ineligible` ou `needs_information`; score de caso A é calculado (90/100 se dados assim resultarem).
4. Usar tokens e logo Ponte Viva aprovados AG-03. Disclosure permanente de demo; role switcher não autentica.
5. Estados canônicos `local_draft`, `saving`, `synced`, `sync_failed` e retry com mesmo UUID. Somente anunciar “salvo na nuvem” após confirmação real da API.
6. Painel AC mescla seeds + remoto, deduplica e recalcula cluster, com botão de refresh real; 4→5 somente se a contagem de fato for cinco.
7. Abertura de chamada, revisão AC e resposta startup permanecem localmente simuladas, nunca descritas como reais.
8. Testar 320px, zoom 200%, teclado, reduced-motion e leitor de tela com AG-10.

## Para AG-11
1. Storytelling: dor observável > diagnóstico > filtros eliminatórios > A solução elegível ou B briefing + recorrência + startup, C como controle de qualidade.
2. Demo de 2m40s com novo B remoto confirmado, atualização AC cross-browser, resposta simulada e contraponto A fixture com ERP X; não fixar contador artificial.
3. Regras 30/20/20/15/15, thresholds 80/65 e score não são oficiais FACESP. Todo caso/catálogo/número é fictício.
4. Sem software criado automaticamente, validação comercial real, publicações reais ou parcerias alegadas sem evidência. Plano B de falha Supabase honesto.

## Riscos pendentes
- G1S: políticas de INSERT/SELECT, minimização e antiabuso não aprovadas/testadas. É bloqueio para habilitar compartilhamento público, não para prototipar UX.
- AG-05/06: cobertura final do catálogo e fixtures precisam confirmar casos A/B/C.
- AG-07: motor determinístico e versões precisam ser integrados/testados.
- AG-10: QA, deploy e smoke multi-navegador ainda sem evidência.

## Arquivos
- UX_FLOW.md: especificação UX canônica AG-04.
- UX_FLOW.mmd: Mermaid isolado de fluxo ponta a ponta.
- HANDOFF_AG04.md: este resumo para integração e pitch.
