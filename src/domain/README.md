# `src/domain/` — tipos e regras puras

| Arquivo | Dono | Situação |
| --- | --- | --- |
| `types.ts` | AG-01 (contrato) / AG-02 (materialização) | Cópia da §4 do `docs/DATA_MODEL.md` v1.0.0. Não redefinir enums localmente. |
| `matchRules.ts` | AG-07 | Pesos, tetos, faixas, process family, ordem dos gates (`match-v1`). |
| `validateNeed.ts` | AG-07 | `validateNeed` / `qualifyNeed`. |
| `eligibility.ts` | AG-07 | `evaluateEligibility` (seis gates). |
| `score.ts` | AG-07 | `calculateCompatibilityScore` (só elegíveis). |
| `matching.ts` | AG-07 | `evaluateSolutionMatch`, `rankSolutions`, `evaluateCatalogMatch`. |
| `briefing.ts` | AG-07 | `generateBriefing`. |
| `clustering.ts` | AG-07 | `detectSimilarNeeds` / `buildDemandClusters`. |
| `HEURISTICS.md` | AG-07 | Documentação da heurística. |
| `index.ts` | AG-07 | Reexportações. |

Regras:

- TypeScript puro: sem React, sem `supabase-js`, sem `fetch`, sem `Date.now()`/`Math.random()` implícitos (injete relógio/IDs).
- Não importa de `data/`, `repositories/`, `services/`, `app/` ou UI (verificado por ESLint).
- Filtros eliminatórios (seis gates) **antes** do score; inelegível nunca recebe `score`.
- Mudança de contrato → proposta ao AG-00 e `schemaVersion` 2; nunca editar `types.ts` para "fazer passar".
