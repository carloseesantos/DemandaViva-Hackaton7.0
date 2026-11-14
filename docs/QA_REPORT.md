# QA REPORT — AG-10 | DEMANDA VIVA

| Campo | Valor |
| --- | --- |
| Agente | AG-10 (QA Lead / Release / Deploy) |
| Data | 2026-11-14 |
| Release candidato | **v0.1.0-rc1-static** (tag sugerida) |
| Versão package.json | `0.1.0` |
| URL pública confirmada | **https://demanda-viva.pages.dev** |
| Tag sugerida / aplicada | `v0.1.0-rc1-static` |
| Commit do release | ver `git rev-parse v0.1.0-rc1-static` (consolidação AG-07 + AG-10) |
| Modo de persistência | **local-only** — sem `VITE_SUPABASE_*` no Pages; `remoteSharingEnabled=false` |
| G1S / CT-10 / CT-12 remoto | **NÃO EXECUTADOS** (não marcar como pass) |

> Este release **não** declara sincronização entre navegadores, INSERT/SELECT público nem autenticação real de AC/startup.

---

## 1. Escopo auditado

| Entrega | Situação |
| --- | --- |
| AG-02 scaffold | Aceito (lint/test/build scripts, SPA Vite) |
| AG-07 motor | Entregue e consolidado (`docs/AG07_HANDOFF.md` + `src/domain/*` + serviços) |
| AG-08 repositórios | Código local OK; remoto **não** implantado; RLS não testada em banco real |
| AG-09 UI | SPA A/B/C/AC/startup/regional navegável na URL publicada |
| ADR-002 | Persistência híbrida documentada; **neste deploy** Supabase deliberadamente off |

**Não alterado por AG-10:** `src/services/*` (coordenação AG-07), migrations/RLS, critérios de domínio.

---

## 2. Comandos e testes automatizados (evidência real)

Ambiente: Node `v24.13.0`, npm `11.6.2`, cwd do repositório.

```bash
npm run check   # lint + test + build
```

| Etapa | Resultado |
| --- | --- |
| ESLint | OK |
| Vitest | **17 files / 91 tests passed** |
| `tsc -b` + Vite build | OK → `dist/` |
| `verify-spa-build` | OK — `index.html` presente, **sem** `404.html`, `findSecrets` sem hits |

Observação: strings `service_role` / `sb_secret_` / `*.supabase.co` no JS minificado são **guards/SDK**, não credenciais. Nenhuma JWT/`eyJ` no bundle. Env Pages: lista vazia.

---

## 3. Matriz obrigatória A–K

| ID | Critério | Resultado | Evidência |
| --- | --- | --- | --- |
| **A** | Match 90/100 com ERP X (EstoquePonte) | **PASS** | URL `…/lojista/resultado/a0a11000-…0001`: “Pontuação **90 de 100**”; 6 gates Aprovado; testes `tests/domain/motor.test.ts` |
| **B** | Bloqueio por integração ausente **SEM score** | **PASS** | Fluxo cenário B na URL: EstoquePonte inelegível; texto “Não mostramos score”; banner offline |
| **C** | Dados insuficientes ≠ sem-match | **PASS** | `…/resultado/c0a11000-…0001`: badge Dados insuficientes; pendências `hasErp`/`requirements`/…; sem score |
| **D** | Seed local + nova demanda Supabase 2ª sessão | **NÃO EXECUTADO** | Release sem Supabase; painel mostra 4 seeds + sessão local; **0 remotos**; não alegar 4→5 cross-browser |
| **E** | Falso cluster evitado (processo/restrições) | **PASS (automático)** | Motor/testes D; UI lista conflitos bloqueantes no cluster candidato |
| **F** | Simulação honesta AC/startup + evidências | **PASS** | Banners “não é login”; evidências `[demo]/synthetic`; botão “Solicitar demonstração (simulação)” |
| **G** | Offline Supabase: aviso e não mente “salvo” | **PASS** | Banner “Modo offline…”; caso B: “Não foi possível sincronizar. A demanda não está confirmada na nuvem.” |
| **H** | RLS/grants/credenciais | **NÃO EXECUTADO / N/A neste release** | Sem vars Supabase; migration local existe mas **não** aplicada; G1S pendente |
| **I** | Mobile/desktop, teclado, deep-link, HTTPS, loading/erro | **PASS parcial** | HTTPS HTTP/2 200; deep-links `/ac/painel`, `/startup/chamadas`, `/regional`, briefing → 200 + `#root`; viewport 390×844 OK; skip link “Ir para o conteúdo”; zoom 200% / leitor de tela **não formalizados** |
| **J** | Segunda AC reproduz o fluxo | **PASS (simulação)** | Filtro AC Alfa/Beta; seeds das duas ACs; perspectiva AC não é auth |
| **K** | Ausência de PII real | **PASS** | Seeds/AC fictícias; guards de teste; sem dados pessoais reais observados |

---

## 4. Smoke na URL pública (2026-11-14)

Base: `https://demanda-viva.pages.dev`

| Rota / ação | HTTP | Observação |
| --- | --- | --- |
| `/` | 200 | Marca DEMANDA VIVA; cenários A/B/C; offline banner |
| `/lojista/diagnostico` | 200 | Entrevista 5 etapas |
| Cenário B → confirmar | SPA | Inelegível sem score + sync falhou honestamente |
| Fixture A | SPA | Score 90/100 + evidências simuladas |
| Fixture C (deep) | 200 | Dados insuficientes |
| `/ac/painel` + refresh | 200 | 4 seeds + 1 sessão local; contagem parcial declarada |
| `/startup/chamadas` | 200 | Shell SPA |
| `/regional` | 200 | Shell SPA |
| `/briefing/e0a11000-…0001` | 200 | Shell SPA |
| Bundle secrets scan | — | `findSecrets` vazio; sem JWT |

Headers relevantes: `HTTP/2 200`, `server: cloudflare`, `x-content-type-options: nosniff`.

Env do projeto Pages: **nenhuma** variável `VITE_SUPABASE_*` (API confirmada).

---

## 5. Checklist de release

- [x] `npm run check` verde (91 testes)
- [x] Build estático `dist/` sem `404.html`
- [x] Deploy Pages sem Supabase
- [x] URL HTTPS verificada (não inventada)
- [x] Deep-link refresh HTTP 200
- [x] A/B/C demonstráveis na URL
- [x] Offline / sem “salvo na nuvem” falso
- [x] Sem chaves secretas no bundle
- [x] `.env.example` só com chaves publicáveis vazias + comentários
- [x] Guia `docs/DEPLOY_PAGES.md`
- [x] Commit consolidando AG-07 + AG-10 docs
- [x] Tag `v0.1.0-rc1-static`
- [ ] CT-10/CT-12 / RLS real (bloqueados por G1S)
- [ ] Zoom 200% e leitor de tela formais

---

## 6. Problemas e riscos

1. Hostname de deployment id (`*.demanda-viva.pages.dev`) pode ter SSL intermitente nos primeiros minutos; preferir **https://demanda-viva.pages.dev**.
2. Bundle JS ~638 kB — aviso Vite; não bloqueia demo.
3. G1S aberto: qualquer claim de persistência remota continua **vetado**.

---

## 7. Plano de contingência

1. Preferir URL Pages acima para gravação.
2. Se Pages cair: `npm run preview` / `npm run dev` + capturas `docs/ag09-screenshots/`.
3. Pitch: dados 100% fictícios; sem sync remoto neste MVP; pesos são proposta da equipe.

---

## 8. Handoff AG-11

**Pode usar na fala / slides:**

- URL: https://demanda-viva.pages.dev  
- Roteiro: Home → B (sem ERP, sem score, briefing) → Painel AC (4 seeds) → cluster/chamada simulada → A (90/100) → Regional  
- Declarar: offline / sem nuvem entre navegadores; simulação ≠ login; não inventar métricas FACESP  

**Não afirmar:**

- Persistência Supabase ativa, 5ª demanda em outro browser, RLS homologada, autenticação AC, critérios oficiais FACESP, tração real  

**Arquivos AG-10:**

- `docs/QA_REPORT.md` (este)
- `docs/DEPLOY_PAGES.md`
- `.env.example` (atualizado)
- `.gitignore` (`.wrangler/`, `.cursor/`)

**Próximo passo técnico:** AG-11 gravar com a URL; PMO registrar aceite; manter Supabase off até G1S.
