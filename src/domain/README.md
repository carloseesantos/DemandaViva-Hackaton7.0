# `src/domain/` — tipos e regras puras

| Arquivo | Dono | Situação |
| --- | --- | --- |
| `types.ts` | AG-01 (contrato) / AG-02 (materialização) | Cópia da §4 do `docs/DATA_MODEL.md` v1.0.0. Não redefinir enums localmente. |
| demais arquivos (gates, score, briefing, cluster, validadores) | **AG-07** | A criar. |

Regras:

- TypeScript puro: sem React, sem `supabase-js`, sem `fetch`, sem `Date.now()`/`Math.random()` implícitos (injete relógio/IDs).
- Não importa de `data/`, `repositories/`, `services/`, `app/` ou UI (verificado por ESLint).
- Filtros eliminatórios (seis gates) **antes** do score; inelegível nunca recebe `score`.
- Mudança de contrato → proposta ao AG-00 e `schemaVersion` 2; nunca editar `types.ts` para "fazer passar".
