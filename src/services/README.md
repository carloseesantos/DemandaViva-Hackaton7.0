# `src/services/` — serviços de aplicação determinísticos (AG-07)

Orquestram funções de `src/domain/` com fixtures de `src/data/` (ex.: `evaluateNeed(need, catalog, clock)`,
`buildBrief`, `suggestClusters`). Expõem API tipada para a UI.

Regras: sem React, sem Supabase, sem I/O; mesma entrada → mesma saída; versões `match-v1`/`catalog-v1` no resultado.
A UI recebe resultados prontos; não recalcula score.
