# `src/data/` — fixtures sintéticas embarcadas no bundle

Tudo aqui é **fictício** e vai para o build público. Nenhum dado de cliente real, PII, CNPJ/CPF, e-mail,
telefone ou preço comercial real. O teste `tests/guards/repository-hygiene.test.ts` procura padrões de PII.

| Arquivo esperado (DATA_MODEL §1) | Dono | Conteúdo |
| --- | --- | --- |
| `associations.ts` | AG-06 | `ac_alfa`, `ac_beta` |
| `startups.ts`, `solutions.ts`, `evidences.ts` | **AG-05** | Catálogo fictício `catalog-v1`, evidências `sourceMode: 'synthetic'` |
| `registries.ts` (`PAIN_TEMPLATES`, `REQUIREMENT_REGISTRY`, `METRIC_REGISTRY`, `BUDGET_CAP_CENTS`, `PROCESS_FAMILY`) | AG-05/AG-06 (coordenar com AG-07) | Registries do DATA_MODEL §1.1 |
| `seed-demands.ts` | **AG-06** | Exatamente as quatro seeds B (`...0001`–`...0004`), `origin: 'seed'` |
| `scenarios/` (proposta) | **AG-06** | Cenários A (ERP X) e C (rascunho) usados na demo, `origin: 'scenario_fixture'`, **separados** das seeds |

Separação de dados:

- **Bundle (`src/data/`)**: só o que a demo precisa exibir.
- **Somente teste (`tests/fixtures/`)**: contraprovas D/E e casos de fronteira que não devem ir ao bundle.
- **Dados reais de clientes**: nunca entram no repositório, nem em `.env`.

Regras: importar apenas tipos de `src/domain/`; sem React/Supabase (verificado por ESLint); IDs estáveis, sem `Math.random()`.
