# `src/repositories/` — adaptadores de persistência (porta `DemandRepository`)

A interface `DemandRepository { save, list, get }` está em `src/domain/types.ts` (contrato AG-01).

| Arquivo | Dono | Situação |
| --- | --- | --- |
| `errors.ts` | AG-02 / AG-08 | Erros tipados (não configurado, seed RO, remoto, validação, mapping). |
| `unconfiguredDemandRepository.ts` | AG-02 | Placeholder legado (rejeita tudo); composition root usa Composite. |
| `DemandRepository.ts` | **AG-08** | Fachada + `createAppDemandRepository`. |
| `staticSeedRepository.ts` | **AG-08** | Seeds AG-06; `save()` → `SeedReadOnlyError`. |
| `unavailableDemandRepository.ts` | **AG-08** | Remoto ausente/bloqueado; `list`=[], `save` rejeita. |
| `supabaseDemandRepository.ts`, `mappers.ts`, `validation.ts`, `supabaseClient.ts` | **AG-08** | Serialização DATA_MODEL §6; Auth Anonymous; confirmação via RETURNING. |
| `compositeDemandRepository.ts` | **AG-08** | Merge/dedupe por UUID (seed vence), ordem `createdAt ASC, id ASC`. |

Ponto de troca: `src/app/createDependencies.ts`.

**`remoteSharingEnabled`:** permanece `false` até G1S (RPC de projeção). Own-select + Anonymous **não** autorizam compartilhamento entre navegadores.

Regras: `supabase-js` só aqui (UI proibida via ESLint); nunca secret/service_role; `save()` só resolve após confirmação do servidor; nada de contagem presumida.
