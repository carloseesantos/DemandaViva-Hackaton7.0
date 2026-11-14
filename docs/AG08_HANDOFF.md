# HANDOFF — AG-08 Persistência / RLS / segurança

| Campo | Valor |
| --- | --- |
| Agente | AG-08 |
| Data | 2026-11-14 |
| Estado | **Código local entregue; remoto NÃO implantado; G1S PENDENTE** |
| Gate | G1S bloqueia INSERT/SELECT público cross-browser e `remoteSharingEnabled` |

## Escopo autorizado

Persistir **somente** novas demandas qualificadas; catálogo/seeds estáticos; sem API Node; sem alterar motor AG-07 nem UI AG-09 além do composition root (`createDependencies`).

## Fontes lidas

- `docs/DATA_MODEL.md` §6–9, §11–12 (DDL, serialização, merge, CT-*)
- `docs/ARCHITECTURE.md` §4–6 (fronteiras, DI, env)
- `docs/DECISIONS.md` (ADR-002 persistência; PEND-02/03; DEC-SEC-BASE)
- Scaffold AG-02 (`env.ts`, `createDependencies`, placeholder repository)
- Seeds AG-06 (`src/data/seed-demands.ts`)

## Arquivos entregues / editados

| Arquivo | Ação |
| --- | --- |
| `supabase/migrations/20261114_001_demo_demands.sql` | criado |
| `supabase/README.md` | setup manual + avisos |
| `docs/AG08_SECURITY_G1S.md` | parecer + matriz políticas/testes |
| `docs/AG08_HANDOFF.md` | este handoff |
| `src/repositories/DemandRepository.ts` | fachada + factory |
| `src/repositories/staticSeedRepository.ts` | criado |
| `src/repositories/supabaseDemandRepository.ts` | criado |
| `src/repositories/compositeDemandRepository.ts` | criado |
| `src/repositories/unavailableDemandRepository.ts` | criado |
| `src/repositories/mappers.ts` | TS ⇄ row |
| `src/repositories/validation.ts` | validação runtime |
| `src/repositories/supabaseClient.ts` | cliente publishable |
| `src/repositories/errors.ts` | erros tipados |
| `src/repositories/README.md` | atualizado |
| `src/app/createDependencies.ts` | Composite ligado |
| `.env.example` | inalterado (já só URL + publishable) |
| `package.json` / lock | `@supabase/supabase-js` |
| `tests/repositories/*.test.ts` | unitários + mocks |
| `README.md` | nota de persistência |

## Comandos / testes executados

```bash
npm install @supabase/supabase-js@^2
npm run check   # lint + test + build
```

- **Vitest:** 16 files / **76 tests passed** (inclui mappers, seeds, composite, mock Supabase, migration-policy, createDependencies).
- **Build:** `verify-spa-build: OK` (sem segredos em `dist/`).
- **Não executados:** apply migration, INSERT/SELECT reais, CT-10/CT-12 em instância Supabase (sem projeto/credenciais).

## Problemas e bloqueios

1. **G1S aberto:** Auth Anonymous sozinho não mitiga flood; Turnstile + deliberação de SELECT/RPC pendentes.
2. **Sem projeto Supabase** neste ambiente → CT-10/CT-12 remotos **não** executados; migration não aplicada.
3. Cross-browser 4→5 **bloqueado** de propósito (sem RPC); `remoteSharingEnabled=false` mesmo com env preenchido.
4. Drive ADR-002 original: conteúdo consumido via `DECISIONS.md` / `DATA_MODEL.md` no repo (link Drive não revalidado).

## Próximos passos

| Quem | Ação |
| --- | --- |
| Equipe | Deliberar G1S (PEND-02/03); aprovar ou rejeitar RPC + Turnstile |
| AG-08/10 | Com credenciais: aplicar migration, testes negativos RLS, smoke INSERT+SELECT próprio |
| AG-09 | Consumir `demandRepository` + estados `synced` / `sync_failed`; banner offline |
| AG-10 | Não publicar URL com escrita pública sem evidência G1S |

## Declaração de limites

Não se alega: projeto Supabase configurado, migration aplicada, INSERT/SELECT cross-browser homologado, nem autenticação de AC.
