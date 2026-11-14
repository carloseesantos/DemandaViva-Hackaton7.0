# `src/services/` — serviços determinísticos

**Dono canônico:** AG-07.

| Export | Função |
| --- | --- |
| `evaluateNeed` / `evaluateSolution` | Matching (gates → score → rank) |
| `buildBrief` | Briefing do caminho B |
| `suggestClusters` / `explainClusters` | Agrupamento + explicações |

Regras: sem React, sem Supabase, sem I/O próprio; mesma entrada → mesma saída (relógio injetável via parâmetro).  
Heurística: `src/domain/HEURISTICS.md`.
