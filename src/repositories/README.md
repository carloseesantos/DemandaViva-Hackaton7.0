# `src/repositories/` — adaptadores de persistência (porta `DemandRepository`)

A interface `DemandRepository { save, list, get }` está em `src/domain/types.ts` (contrato AG-01).

| Arquivo | Dono | Situação |
| --- | --- | --- |
| `errors.ts`, `unconfiguredDemandRepository.ts` | AG-02 | Placeholder do scaffold: **rejeita** todas as operações. |
| `staticSeedRepository.ts` | **AG-08** (lê seeds do AG-06) | A criar. `save()` falha explicitamente (read-only). |
| `supabaseDemandRepository.ts`, `mappers.ts` | **AG-08** | A criar. Serialização DATA_MODEL §6; revalidar retorno. |
| `compositeDemandRepository.ts` | **AG-08** | A criar. Merge/dedupe por UUID (seed vence), ordenação `createdAt ASC, id ASC`. |

Ponto de troca: `src/app/createDependencies.ts`. Só o AG-08 pode definir `remoteSharingEnabled: true`, e somente
com adaptador remoto real e G1S aprovado.

Regras: `supabase-js` só é importado aqui (UI é proibida via ESLint); nunca usar secret/service_role; `save()` só
resolve após confirmação do servidor; nada de contagem presumida.
