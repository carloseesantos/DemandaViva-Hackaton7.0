# DEMANDA VIVA — AG-07 | Handoff do núcleo determinístico

**Data:** 14/11/2026  
**Agente:** AG-07 (matching, briefing, clustering)  
**Contrato:** AG-01 `schemaVersion=1` · `match-v1` · `catalog-v1` · `cluster-signature-v1`  
**Natureza:** motor **proposto pela equipe** (Doc 02). Não são critérios oficiais FACESP.

## 1. Escopo entregue

Substituição dos mocks tipados AG-09 em `src/services/*` por motor canônico puro em `src/domain/*`, **preservando** a API pública:

- `evaluateNeed(need, evaluatedAt?, catalogue?) → MatchEvaluation`
- `evaluateSolution(need, solution, evaluatedAt, evidence?) → MatchResult`
- `buildBrief(need, evaluation, generatedAt?) → Brief`
- `suggestClusters(needs) → DemandCluster[]` (+ `explainClusters`)

Sem alteração de UI, repositórios, Supabase, `types.ts` ou catálogo AG-05/06.

## 2. Arquivos

| Caminho | Papel |
| --- | --- |
| `src/domain/matchRules.ts` | Pesos 30/20/20/15/15, tetos, faixas, ordem dos gates |
| `src/domain/validateNeed.ts` | `validateNeed` / `qualifyNeed` |
| `src/domain/eligibility.ts` | `evaluateEligibility` (6 gates) |
| `src/domain/score.ts` | `calculateCompatibilityScore` (só elegíveis) |
| `src/domain/matching.ts` | rank + avaliação de catálogo |
| `src/domain/briefing.ts` | `generateBriefing` |
| `src/domain/clustering.ts` | `detectSimilarNeeds` |
| `src/domain/HEURISTICS.md` | Documentação da heurística |
| `src/domain/index.ts` | Reexportações |
| `src/services/{matching,brief,cluster}Service.ts` | Wrappers + injeção do catálogo |
| `tests/domain/motor.test.ts` | Testes canônicos A/B/C/D/E/ordem |
| `tests/services/matchingService.test.ts` | Regressão da API pública |
| `docs/AG07_HANDOFF.md` | Este handoff |

## 3. Comportamento verificado

| Cenário | Resultado |
| --- | --- |
| **A** (ERP X + EstoquePonte) | 6 gates `pass`; notas `5,5,4,4,4`; **score 90** calculado; `recommended` |
| **B** (seeds sem ERP) | EstoquePonte `ineligible` por `technical_dependencies`; **sem score**; briefing em minuta |
| **C** (incompleto) | `insufficient_data`; sem resultados; **sem briefing definitivo** |
| Expirada (VisorDeLegado) | `curation_evidence=fail`; sem match confirmado |
| Custo `null` (FechoRápido) | `hard_budget=unknown` → `needs_information` |
| **E** variante R$ 299 | `hard_budget=fail`; catálogo real R$ 199 permanece `pass` |
| **Cluster** | 4 seeds B no mesmo bucket; **D** (mesmo texto, ERP/digital) fora |
| Ordem | Catálogo/seeds embaralhados → mesmos tops, scores e `needIds` |

## 4. Comandos executados

```bash
npm test          # 91 testes OK
npm run lint      # OK
npm run typecheck # OK
npm run check     # lint + test + build (SPA dist) OK
```

## 5. Limitações

- Evidências, preços e pilots são **100% simulados**.
- Revisão AC / chamada a startup continuam **simulação de UI**.
- Fatos móveis/offline/treinamento vêm de `solutionDisplayDetails` (AG-05), injetados pelo serviço — não fazem parte do tipo congelado `Solution`.
- `tests/support/referenceMatcher.ts` permanece oráculo AG-05; **não** é o motor de produção.
- G1S remoto, RLS e deploy Pages ficam com AG-08/AG-10.

## 6. Próximos passos

1. **AG-10:** QA/smoke com motor real; `docs/QA_REPORT.md`; Pages estático.
2. **AG-09:** nenhuma mudança de contrato necessária; regressão visual A/B/C/AC.
3. **AG-00:** registrar aceite AG-07 após evidência deste handoff + `npm run check`.
4. Não alterar pesos/faixas sem decisão em `DECISIONS.md`.
