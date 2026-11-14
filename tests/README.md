# `tests/` — Vitest (jsdom)

Espelha `src/` por camada; cada agente escreve na sua pasta:

| Pasta | Dono | Exemplos |
| --- | --- | --- |
| `app/` | AG-02/AG-09 | rotas, env, providers |
| `domain/` | AG-02 (contrato) / **AG-07** | CT-01…CT-08 do DATA_MODEL §11 |
| `data/` | AG-05/AG-06 | integridade de fixtures, IDs estáveis, B inelegível |
| `repositories/` | **AG-08** | mapper, merge/dedupe, CT-06/CT-11 |
| `features/`, `pages/` | AG-09 | componentes e fluxos |
| `fixtures/` | AG-06 | dados **somente de teste** (contraprovas D/E), fora do bundle |
| `guards/` | AG-02/AG-10 | ausência de segredos e PII |

Testes de RLS contra banco real (CT-09/CT-10) não rodam aqui; ficam com AG-08 em `supabase/`.
