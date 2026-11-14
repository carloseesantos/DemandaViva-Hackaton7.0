# HANDOFF — AG-05 / Curadoria de catálogo sintético — v1.0.0

**Data:** 14/11/2026. **Escopo:** Demanda Viva, desafio FACESP do Hackathon Connect 7.0. **Estado real:** fixtures, documentação e testes de referência produzidos e verificados em ambiente isolado; **NÃO** integrados ao repositório de aplicação nem ao AG-07 de produção; não há deploy, revisão de AC real ou validação comercial.

## Fontes lidas e status

- Drive do projeto, documentos 00 (marca), 01 (governança), 02 (gates/score), 03 (briefing/cluster) e ADR-002 (persistência híbrida): acessíveis e efetivamente lidos.
- `DATA_MODEL.md` AG-01 v1.0.0: acessível e lido; `DECISIONS.md` do AG-00 registra aprovação G1 do modelo de dados (registro `DEC-APP-G1-20261114`). Seu próprio cabeçalho ainda documenta o estado anterior **pré-aprovação**; prevalece o checkpoint mais recente do PMO.
- `PROJECT_CONTEXT.md`, `AGENTS.md`, `DECISIONS.md` consultados para fronteiras; não foi fornecido workspace Git/CLI de produção, por isso não se afirmou alteração no app.
- Nenhuma startup real pesquisada; nenhuma evidência de fornecedor real usada. Toda alegação empresarial, preço, maturidade e suporte é inventada exclusivamente para testar lógica.

## Arquivos concretos

| Caminho | Função / ownership |
|---|---|
| `src/data/startups.ts` | **AG-05** — quatro startups 100% fictícias; relacionamentos de soluções e papel de contato simulado |
| `src/data/solutions.ts` | **AG-05** — cinco soluções, nove evidências sintéticas, metadados de UX e datas; IDs estáveis |
| `src/data/catalog-enums.ts` | **AG-05** — rótulos de chaves canônicas, budgets fictícios, aviso DEMO; **não** redefine enums do AG-01 |
| `src/domain/types.ts` | **Cópia isolada** dos tipos canônicos AG-01 para executar testes; no app **não sobrescrever** `types.ts` existente sem diff/aceite AG-01/02 |
| `tests/scenarios.ts` | Fixtures sintéticas A/B/C e D/E para teste, fora das quatro seeds de produção |
| `tests/support/referenceMatcher.ts` | **Executor de teste**, não código AG-07 de produção; gates e score calculados de dados |
| `tests/catalog.check.ts` | Cinco testes executáveis cobrindo cenário A/B/C, condicional e curadoria unknown/expirada |
| `docs/ENUM_DICTIONARY.md` | Dicionário de tipos, status, gates, pesos e limites internos |
| `docs/TRACEABILITY.md` | Requisito → solução → gate + evidências e cenários |
| `docs/UX_NOTES.md` | Textos e comportamentos para AG-04/09 |

## Como integrar sem conflito de ownership

1. AG-02/AG-01 validam o `src/domain/types.ts` já existente contra o contrato; usar a versão aprovada no repositório, **não substituir automaticamente** pelo espelho deste pacote.
2. AG-05 transfere apenas `src/data/startups.ts`, `solutions.ts`, `catalog-enums.ts` e docs; ajustar o nome de export apenas se o padrão do repositório solicitar, sem modificar IDs ou semântica.
3. AG-06 cria as quatro seeds **sem ERP**, IDs `e0a11000-...0001` a `...0004`, de duas ACs; o cenário A com ERP X é somente fixture separada. Não embutir um resultado de match/score pré-calculado nas seeds.
4. AG-07 implementa MatchingService com seis gates eliminatórios antes do score. Pode comparar os resultados com `tests/support/referenceMatcher.ts`, mas **não** considerar a implementação auxiliar aprovação de regras novas. Mapeamento numérico de notas por razão de orçamento, quantidade de evidências e horas de implantação é **heurística auxiliar de AG-05**, proposta para teste — precisa de alinhamento com AG-07/PMO antes de ser baseline de produto. Pesos, gates e thresholds permanecem os do Doc 02.
5. AG-09 conecta mensagens e cartões via `solutionDisplayDetails`, `CURATION_LABELS`, `catalogEvidence`; mantém avisos visíveis e impede false match/cadastro real de startups.
6. AG-10 testa motor REAL do AG-07 com os mesmos cinco cenários, mais datas de expiração após 2027, economia desconhecida, conflito de privacidade e falhas de segurança G1S.

## Testes efetivamente executados (ambiente isolado)

**Comando:** `tsc -p tsconfig.json && node dist/tests/catalog.check.js` com TypeScript 5.8.3 / Node.js 22.16.0.

- CT-01 **PASS**: A com ERP X; EP seis gates aprovados; notas calculadas 5,5,4,4,4; resultado 90. Reexecução idêntica gera JSON idêntico.
- CT-02 **PASS**: B sem ERP; todos os cinco produtos são inelegíveis; EP falha em `technical_dependencies`; propriedade `score` não existe no resultado.
- CT-03 **PASS**: C mantém `insufficient_data`, resultados vazios e `localOnly`; o executor não faz INSERT remoto.
- CT-04 **PASS**: D retorna `conditional`, pontuação calculada 72 para VR.
- CT-05 **PASS**: VL expirada bloqueada pela curadoria; FR com custo `null` retorna `needs_information`; 4 startups/5 soluções, FKs e nove evidências `synthetic` íntegras.

**Limitações da evidência:** o teste verifica só o **executor de referência**, não o motor AG-07, integração React, banco Supabase, cookies, RLS ou navegador; nenhum dado externo/mercado verificado. `isDemo` e validação são de cenário fictício.

## Riscos e decisões

- **R-04 falso match:** prioridade máxima: nenhuma solução de estoque que opere sem ERP pode ser adicionada ao catálogo sem rever o cenário B e registrar decisão/alteração de contrato.
- **R-03 divergência de contrato:** campos e enums canônicos não devem ser ampliados silenciosamente. `solutionDisplayDetails` é estrutura de apresentação fora do contrato persistente; AG-07 deve formalizar dependência para métricas adicionais se adotá-la.
- **R-06 evidências fictícias expostas como reais:** sempre mostrar status simulado e fonte synthetic; dados de terceiros não foram validados.
- **R-13 persistência:** catálogo, custos e evidências nunca vão ao Supabase no P0. Guardar exclusivamente a necessidade nova confirmada, sujeito ao G1S e RLS, conforme ADR-002.
- **PEND-05:** critérios reais mínimos de curadoria e prazos de revisão exigem deliberação da equipe/rede antes de operação real.
- **PEND-08:** heurística de ratings do executor auxiliar requer aceite AG-07/PMO, mas não altera os pesos/thresholds vigentes na demo.
- **PEND-09:** adotada a faixa solicitada no prompt de AG-05 (4 startups, 5 soluções); decisão de escopo final em PMO pode revisar a cardinalidade.
- **G1S:** acesso remoto Supabase é decisão de segurança ainda não liberada por este pacote.

**Próximo passo contratual:** AG-07 executar a elegibilidade no serviço real e expor resultado tipado; AG-09 apresentar bloqueios/condicional em UX; AG-00 registrar aceite G2 antes de incorporar como baseline final.
