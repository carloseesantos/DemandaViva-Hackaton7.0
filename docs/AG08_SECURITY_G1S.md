# AG-08 — Parecer G1S e matriz de políticas

> **Estado:** proposta técnica AG-08 · **G1S:** ainda **PENDENTE** (equipe)  
> **Data:** 2026-11-14 · **Escopo:** `public.demo_demands` + Auth no browser  
> **Não implantado:** não há projeto Supabase comprovado neste workspace; SQL é arquivo local.

## 1. Avaliação: Auth Anonymous + CAPTCHA/Turnstile

| Controle | Efeito | Limite |
| --- | --- | --- |
| **Auth Anonymous** | `owner_id = auth.uid()`; RLS separa INSERT/SELECT por sessão | **Não** limita flood: cada visitante pode abrir N sessões anônimas |
| **RLS insert own + select own** | Bloqueia UPDATE/DELETE; anon sem sessão não escreve; sem SELECT de terceiros | Cross-browser (painel AC em outro navegador) **não** vê a 5ª demanda |
| **Turnstile / CAPTCHA no sign-in anônimo** | Mitigação **efetiva** de criação em massa de sessões (config server-side no Supabase) | Exige chave secreta **só no projeto Supabase**, nunca em `VITE_*` |
| **CHECKs / templates / JSONB restrito** | Rejeita texto livre, PII óbvia e enums inválidos | Não substitui moderação humana nem rate limit de plataforma |
| **SELECT público irrestrito / GRANT amplo** | — | **Recusado.** Sem autenticação de AC não há autorização real |

**Recomendação AG-08 (PEND-02 / PEND-03):**

1. Habilitar **Anonymous Sign-Ins** somente com **CAPTCHA (Turnstile)** no Auth do projeto.
2. Manter policies `demo_insert_own_synthetic` + `demo_select_own` (migration `20261114_001`).
3. **Não** liberar RPC de projeção cross-browser até a equipe aprovar G1S explicitamente, com testes negativos CT-10/CT-12.
4. Se Turnstile ou ambiente não estiverem disponíveis na banca → **fallback honesto**: SPA + seeds; `remoteSharingEnabled=false`; sem alegar “salvo na nuvem” / contagem 4→5 remota.

Sem mitigação antiabuso aprovada, **escrita pública segura não é viável** → bloqueio documentado, não policies abertas.

## 2. Matriz de políticas (migration 001)

| Operação | Papel | Esperado | Policy / GRANT |
| --- | --- | --- | --- |
| INSERT ficha sintética própria | `authenticated` (anon sign-in) | Permitido se `owner_id=auth.uid()`, `is_demo`, `status=qualified` | `demo_insert_own_synthetic` + GRANT colunas explícitas |
| INSERT sem sessão | `anon` / sem JWT | **Negado** | Sem GRANT insert a `anon` |
| SELECT própria linha | `authenticated` | Permitido | `demo_select_own` |
| SELECT linha de outro owner | `authenticated` | **Negado** (pré-G1S) | Ausência de policy ampla |
| SELECT / INSERT | `anon` | **Negado** | `REVOKE ALL` + sem policies |
| UPDATE / DELETE / TRUNCATE | visitante | **Negado** | Sem GRANT e sem policy |
| Ler `owner_id` em projeção pública | qualquer | **Não expor** em RPC futura | RPC (se aprovada) lista colunas explícitas sem `owner_id` |
| service_role no browser | SPA | **Proibido** | `env.ts` + higiene de repo |

## 3. RPC de projeção (somente após G1S)

Proposta (ainda **não** versionada como migration aplicada):

- `list_demo_demands` / `get_demo_demand` · `SECURITY DEFINER` · `SET search_path = ''`
- Retorno: colunas sintéticas explícitas (sem `owner_id`)
- `EXECUTE` só para `authenticated`; `REVOKE` de `PUBLIC`
- Limite/paginação; sem `SELECT *` / `SETOF demo_demands`
- Transparência na UI: leitura é pública a quem abrir sessão anônima — **não** é privilégio de AC

Até aprovação: **não** aplicar; demo local + select próprio.

## 4. Matriz de testes

| ID | Caso | Resultado local AG-08 | Resultado remoto |
| --- | --- | --- | --- |
| CT-06 | 4 seeds + 0/1 remoto (mock) | **Pass** (unitário) | Pendente projeto |
| CT-09 | payload inválido / PII / enum | **Pass** (validação TS + SQL documentado) | Pendente apply |
| CT-10 | anon / outro owner / UPDATE / DELETE | Documentado na matriz; SQL com RLS restritiva | **Não executado** (sem instância) |
| CT-11 | rede fora no `save` | **Pass** (mock rejeita; seeds preservados no list) | Pendente |
| CT-12 | outro navegador | **Bloqueado** sem RPC G1S — aviso UI | Pendente G1S |

## 5. Fallback operacional

- Sem `VITE_SUPABASE_*` ou com chave secreta recusada → modo local (`createUnavailableDemandRepository`).
- Com URL+publishable configurados mas G1S aberto → cliente pode gravar/ler **próprias** linhas se migration+Anonymous estiverem aplicados; **`remoteSharingEnabled` permanece `false`**.
- UI (AG-09): “salvo na nuvem” só após `save()` resolvido; offline → `sync_failed` / banner offline.
