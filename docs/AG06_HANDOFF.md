# DEMANDA VIVA — AG-06 | Handoff de dados sintéticos e testes

**Data:** 14/11/2026  
**Versão:** AG06-v1.0.0 · contrato AG-01 `schemaVersion=1` · regras `match-v1` · catálogo AG-05 `catalog-v1`  
**Natureza:** TODO O CONTEÚDO É SINTÉTICO E DESTINADO EXCLUSIVAMENTE À DEMONSTRAÇÃO.  
**Status:** arquivos de integração preparados; QA integrado do motor AG-07, Supabase, navegadores e deploy **não executado** neste pacote.

## 1. Fontes consultadas e decisões respeitadas

- Documentos oficiais internos 00, 01, 02, 03 e ADR-002 na pasta oficial do Drive; disponíveis e lidos.
- `docs/DATA_MODEL.md` AG-01 v1.0.0 e `src/domain/types.ts` no GitHub; contrato aprovado G1, congelado.
- Catálogo AG-05 efetivamente publicado em `src/data/solutions.ts`, `startups.ts` e `catalog-enums.ts`; EstoquePonte (`solution:estoqueponte-v1`) requer ERP X, R$ 199/mês fictícios, 8 horas de implantação, treino demonstrativo de 2h, três evidências sintéticas vigentes na data-base.
- Checkpoint AGENTS.md v1.3.0 libera AG-06 para fixtures definitivas. As regras, pesos `30/20/20/15/15`, faixas `80/65` e os gates pertencem ao **protocolo proposto pelo Doc 02**, não são critérios oficiais FACESP.

## 2. Arquivos entregues

| Caminho relativo ao repositório | Destino e propósito |
|---|---|
| `src/data/associations.ts` | Duas ACs fictícias (`ac_alfa` e `ac_beta`) |
| `src/data/registries.ts` | Dicionários e templates em conformidade com AG-01/DDL; `BUDGET_CAP_CENTS` é reexportado do AG-05 |
| `src/data/seed-demands.ts` | **Exatamente quatro QualifiedNeed** estáveis, `origin:'seed'`, nunca gravadas remotamente |
| `src/data/scenarios/demo-scenarios.ts` | A elegível com ERP X e C incompleta, separadas das seeds; dados visuais locais |
| `tests/fixtures/ag06-negative-scenarios.ts` | Contraprovas D (falso cluster) e E (orçamento com variante de preço SOMENTE teste) |
| `tests/data/ag06-seeds.test.ts` | Testes de integridade, gaps e referência de matching (não equivalem ao motor AG-07) |
| `docs/AG06_HANDOFF.md` | Este handoff com matriz, narrativa e passos de demo |

**Dependências presentes no repositório de destino:** `src/domain/types.ts` AG-01, `src/data/catalog-enums.ts` e `solutions.ts` AG-05, `tests/support/referenceMatcher.ts` AG-05, pacote `vitest` do AG-02. Estes arquivos **não** foram sobrescritos.

## 3. Quatro demandas iniciais e recorrência simulada

Todos os registros têm `painCode=stock_confirmation_delay`, `channelCode=whatsapp`, `frequencyCode=daily`, `hasErp=false`, `erpCode=null`, `isDemo=true`, `status=qualified`, `metric=confirmation_minutes`, linha de base **7 minutos** e meta ilustrativa **2 minutos** em duas semanas. O resumo é o template obrigatório: `A confirmação manual de estoque atrasa respostas a pedidos.`

| Loja sintética | AC | Segmento/porte | Processo atual | Particularidade preservada fora do schema | Orçamento/treinamento |
|---|---|---|---|---|---|
| L-001 / `...0001` | AC Alfa | Papelaria/micro | `spreadsheet_check` | ~850 SKUs; planilha atualizada 2×/dia | `low` / 2h |
| L-002 / `...0002` | AC Alfa | Moda/micro | `visual_check` | ~320 SKUs; tamanhos e cores; verificação em arara | `low` / 1h |
| L-003 / `...0003` | AC Beta | Utilidades/pequeno | `manual_message` | 2 unidades; ~1.400 SKUs; conversa com outra equipe | `medium` / 3h |
| L-004 / `...0004` | AC Beta | Presentes/micro | `spreadsheet_check` | ~600 SKUs; sazonalidade de reposição | `low` / 2h |

IDs completos: `e0a11000-0000-4000-8000-000000000001` a `...0004`.

As variações de SKU, unidades e rotina estão apenas no `seedDemoNarrative` (metadado de UI): **não** foram incluídas como propriedades novas em `QualifiedNeed` ou em colunas do Supabase. O contrato mantém distinções operacionais por `segmentCode`, `processCode`, requisitos, orçamento e treinamento. Demanda L-003 pede `multi_store` obrigatório; L-002 pede `short_training` obrigatório.

**Agregação preliminar antes de quaisquer remotos:** 4 registros distintos de demonstração → 2 ACs → **1 bucket candidato** `stock_confirmation_delay|manual|no_erp|whatsapp` → 1 **cluster sugerido** sujeito a revisão de conflitos do AG-07 e validação simulada da AC. Isso NÃO demonstra quatro lojistas reais independentes nem significa aprovação automática de chamada.

## 4. A–E: resultado esperado e razões dos gates

| Cenário | Inclusão | Condição | Esperado no protocolo de teste |
|---|---|---|---|
| **A** | `src/data/scenarios/` (não nas seeds) | Papelaria com ERP X, teto `medium`, EstoquePonte | `recommended`, 6 gates `pass`, notas `5/5/4/4/4`, score **90/100 calculado** no executor AG-05; aceite AC somente simulado |
| **B** | Quatro seeds B | WhatsApp sem ERP X; estoque por planilha/visual/mensagens | EstoquePonte `ineligible` por `technical_dependencies`, **sem `score`/`breakdown`**; `no_eligible_catalog_solution` e briefing individual **em minuta** |
| **C** | `src/data/scenarios/` | Ausência de ERP, requisitos, restrições e indicador ainda não esclarecidos | `insufficient_data`, `results=[]`, nenhum INSERT, nenhum briefing definitivo |
| **D** | `tests/fixtures/` (fora do bundle) | Texto do problema **idêntico** ao B, mas `erp_lookup`, `hasErp=true` e `dataSharing=none` | Bucket `stock_confirmation_delay\|digital\|erp\|whatsapp`, **separado** do B; EstoquePonte `data_privacy=fail`; proibir cluster baseado só em texto |
| **E** | `tests/fixtures/` (fora do bundle) | ERP X, orçamento `low` (teto R$ 200); variante de EstoquePonte a R$ 299 **somente em teste** | Variante `hard_budget=fail`, `ineligible`, sem score. **Catálogo real aprovado permanece a R$ 199 e PASSA no gate de custo**; nunca alegar que o catálogo atual reprova E por orçamento |

**Gates propostos (Doc 02):** `essential_function`, `technical_dependencies`, `hard_budget`, `data_privacy`, `coverage`, `curation_evidence`. **Nenhum** score é permitido se qualquer gate reprovar. Faixas de indicação também são propostas da equipe, não critérios FACESP.

**Por que não alterar E diretamente no catálogo?** O contrato AG-01 tem menor `BudgetBand=low`, teto R$ 200, e o menor preço do estoque compatível com ERP X (EstoquePonte) é R$ 199. Sem alterar catálogo ou tipagem de orçamento, não existe par necessidade/EstoquePonte que falhe pelo preço. A variante R$ 299 é isolamento intencional de teste. Se quiser que E seja percorrido na UI com o catálogo real, registrar nova decisão de produto com AG-00 e AG-05 antes de mudar qualquer preço/limite.

## 5. Nova quinta demanda a cadastrar **pela UI** — roteiro de demonstração

**Pré-condição:** `G1S` (RLS, grants, controle antiabuso e política de leitura sintética) aprovado/testado pelo AG-08; Supabase funcional e app publicada. Sem isso, demonstrar somente modo offline e não alegar sincronização. Abrir duas sessões de navegador distintas: lojista (Aba 1) e perspectiva AC (Aba 2 ou navegador anônimo). Trocar perspectiva é visual, **não** autenticação.

1. Na Aba 2, clicar **Atualizar demandas**. Registrar o contador real `N0` dos registros distintos que compõem o bucket B, as ACs participantes e o estado de conectividade. Quatro seeds constituem a base; podem existir `R0` remotos anteriores. Nunca anunciar `4 → 5` antes de verificar.
2. Aba 1: **Novo diagnóstico fictício**. Escolher AC Beta, segmento **Mercearia** (`grocery`), porte **micro**, canal **WhatsApp**, dor **demora na confirmação do estoque**, processo atual **planilha** (`spreadsheet_check`), frequência **diária**, **sem ERP** (`hasErp=false`,`erpCode=null`). O texto persistível deve vir do template do `painCode`, não ser livre.
3. Informar requisitos **obrigatórios**: `stock_lookup`, `whatsapp_workflow`, `no_erp_dependency`, `mobile_access`; **desejáveis**: `manual_stock_update`, `short_training`. Selecionar orçamento sintético `low` (R$ 200/mês), compartilhamento `restricted`, acesso móvel `true`, offline `false`, treinamento máximo 2h.
4. Indicador: `confirmation_minutes`, linha de base fictícia `7`, meta `2`. Confirmar descrição e caráter demonstrativo. O app gera **UUID v4 novo uma única vez** para a ficha e o reutiliza se houver retry. `createdAt` será devolvido pelo servidor; não enviar ID ilustrativo fixo nem `demoClusterKey` gerado manualmente.
5. Motor verifica gates antes de score. EstoquePonte deve falhar por ERP X obrigatório; mostrar **“Não identificamos uma solução elegível no catálogo consultado, considerando as restrições informadas.”** Gerar briefing em minuta, com `not_requested`/`draft` até simular revisão e autorização.
6. Confirmar gravação de `QualifiedNeed` sintética. Somente após **retorno positivo do Supabase** apresentar **“Demanda registrada na demonstração”**, estado `synced` e **UUID real retornado**, por exemplo capturado como `newDemandId`. Se falhar: `sync_failed`, “não sincronizada”; não dizer que salvou na nuvem.
7. Aba 2, outra sessão: acionar **Atualizar demandas** e aguardar leitura verdadeira (não simular com estado local). Mesclar 4 seeds + todos os remotos, deduplicar **por UUID**, recontar e destacar `newDemandId` na lista/cluster. Esperado para o bucket: `N1=N0+1` **somente se a leitura completa incluiu nova ID e ela não existia antes**. Com outro remoto anterior, pode aparecer `5 → 6`, `7 → 8` etc. Não hardcodar.
8. Exibir evidência de recorrência como **“N1 registros demonstrativos de 2 associações”**, além das diferenças segmentais e operacionais; sugerir minuta de oportunidade à startup. Revisão, abertura e resposta de startup continuam **simuladas**, sem envio real.

**Pseudoasserções de UI/QA:** `newDemandId` não vazio; `remoteIds.has(newDemandId)===true` depois do refresh; `mergedIds` únicos; `bucketB.needIds.includes(newDemandId)===true`; novo registro destacado pelo ID; `N1===N0+1` condicionado a consistência de leitura; `seedCount===4`; nenhuma confirmação falsa no timeout. Caso `list` retorne paginação incompleta, exibir **“contagem parcial”**.

## 6. Contagens e proteção contra falso cluster

- **Somente quatro seeds:** 4 registros únicos, 2 ACs, 1 bucket candidato B, 1 sugestão de cluster (dependente de revisão de conflitos).
- **Adicionar A e C como fixtures de teste:** zero alteração no painel de seeds; A seria bucket digital/ERP separado caso fosse exibido temporariamente; C nunca é qualificada.
- **Adicionar D só ao teste:** não entra no bundle; a mesma descrição textual pertence ao contexto digital/ERP + privacidade `none`, não ao bucket B.
- **E:** só teste; orçamento avaliado por gate em solução de preço controlado.
- **Com R remotos pré-existentes:** contagem consolidada = cardinalidade do conjunto de UUIDs após merge; **não** `4+R` às cegas caso haja colisões/idempotência. Sempre mostrar total real e destacar `newDemandId`.
- **Subclusters de segundo estágio:** AG-07 verifica requisitos obrigatórios, `metric.code`, compartilhamento, offline, mobilidade, orçamento e treinamento. Mesmo bucket não é prova automática de compatibilidade: reportar `blockingConflicts` e manter casos divergentes separados.
- **Associação ≠ identidade de loja:** um UUID de demonstração é um registro, não identificação independente verificada de um lojista real.

## 7. Checklist LGPD, privacidade e segurança de demonstração

- [ ] Somente identidades fictícias AC Alfa/AC Beta e lojas L-001 a L-004; nunca nomes de lojistas reais, CPF/CNPJ, telefone, e-mails, endereços ou credenciais.
- [ ] `isDemo=true` em seeds, cenários e remotos; aviso permanente na UI: **“Dados 100% fictícios — demonstração sem clientes, parcerias ou validações reais.”**
- [ ] `problemSummary` derivado de `PAIN_TEMPLATES[painCode]`; sem anotações livres ou transcrições em Supabase.
- [ ] `requirements` normalizados por código, `NeedConstraints` só com cinco chaves do contrato, meta numérica e data do servidor.
- [ ] A/C/D/E excluídos da coleção de quatro seeds; D/E dentro de `tests/fixtures`, sem import de UI de produção.
- [ ] Nenhum `MatchResult`, score, Brief, catálogo ou dados de startups inserido no Supabase P0; persistir somente novas necessidades qualificadas remotas.
- [ ] `NeedDraft` ou `insufficient_data` nunca faz INSERT; erro remoto preserva status `sync_failed` sem falsa confirmação.
- [ ] Apenas URL pública e publishable key no frontend; **nunca** `service_role`, secret key ou connection string.
- [ ] RLS **e** GRANTs aprovados; testar papéis anon/authenticated, isolamento de proprietário, SELECT de projeção mínima e UPDATE/DELETE negados.
- [ ] Sem login institucional real: perspectiva AC **não concede autorização**; não aceitar dados verdadeiros.
- [ ] Proteção antiabuso no endpoint de gravação e limpeza periódica de registros de demonstração; evitar spam antes da banca.
- [ ] Compartilhamento de briefings/chamadas apenas simulado e anonimizado; revisão e consentimento real não são inferidos.
- [ ] Contagem, RLS e performance verificadas em outra sessão, com tratamento honesto de indisponibilidade/paginação.

## 8. Handoff por agente

**AG-07 (matching, briefing, clustering)**
- Consumir `seedDemands` como `QualifiedNeed[]` local e `demoScenarioA/C` como fixtures; **não** substituir `tests/support/referenceMatcher.ts` por motor de produção.
- Usar 6 gates (antes do score); A 90 calculado, B sem score e briefing, C `insufficient_data`, D sem cluster de texto, E com catálogo variante **apenas de teste**.
- Assinatura-base calculada por `deriveDemoClusterKey`; hashing/segundo estágio segundo DATA_MODEL §9. Registrar conflitos e manter `review.status='suggested'`.
- Não importar metadados narrativos como campos persistentes.

**AG-09 (UI/integração)**
- Exibir quatro relatos locais e ACs fictícias. Carregar cenas A e C apenas na área de demonstração; D/E exclusivamente em testes.
- Campos categóricos, confirmação de ficção, templates, label de origem (seed/remote), estado `saving/synced/sync_failed` e destaque da nova UUID.
- Mostrar quantidades reais após refresh e indicação de `contagem parcial` se listagem incompleta; perspectiva de AC não representa login.

**AG-10 (QA/release)**
- Rodar `npm run check` com testes AG-06 adicionados; repetir **contra MatchingService real AG-07** após integração; verificar não regressão do catálogo AG-05.
- Executar CT-01/02/03/05/06/07/08/09/10/11/12 conforme AG-01 e smoke de duas sessões, RLS, offline e deduplicação.
- Capturar evidência (execução, commit, URLs, screenshots) antes de anunciar resultados. Não desabilitar RLS para demo.

**AG-00 (governança)**
- Registrar entrega e aceite condicionado a compilação/testes do repositório, teste real de RLS, revisão do cenário E e validação da heurística de notas AG-05 com AG-07.

## 9. Limitações explícitas

Este pacote não consulta Supabase, não cria cliente real, não envia chamadas a startups, não autentica AC e não comprova implantação/resultado de negócio. O orçamento, os tempos, SKUs, preços e a recorrência são hipóteses de demonstração. O resultado A=90 no catálogo de referência exige reprodução pelo motor integrado AG-07 antes de declarar o produto testado.
