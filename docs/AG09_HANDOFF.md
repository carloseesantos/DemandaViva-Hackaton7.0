# HANDOFF — AG-09 Frontend DEMANDA VIVA

**Data:** 2026-11-14  
**Agente:** AG-09  
**Status:** SPA demonstrativa navegável entregue; integração remota cross-browser ainda bloqueada por G1S/`remoteSharingEnabled=false`.

## Fontes lidas
- `docs/UX_FLOW.md`, `docs/ux/HANDOFF_AG04.md`, `docs/ARCHITECTURE.md`, `docs/DATA_MODEL.md` (via `src/domain/types.ts`)
- Tokens/marca AG-03 (`src/styles/brand-tokens.css`, `AG-03_BRAND/`)
- Catálogo AG-05, seeds/cenários AG-06
- Repositórios AG-08 (chegou durante a execução; composition root já monta Composite)
- Git: branch `main`, up to date com `origin/main` no início do trabalho

## Lacunas identificadas (não inventadas)
| Item | Situação |
|---|---|
| AG-07 MatchingService canônico | **Ausente** → mocks tipados em `src/services/{matching,brief,cluster}Service.ts` (substituíveis sem mudar assinatura) |
| AG-08 G1S / `remoteSharingEnabled` | Adaptadores presentes; sharing cross-browser **false**; UI não alega “salvo na nuvem” sem confirmação |
| Deploy Cloudflare / URL pública | Fora de escopo AG-09 → AG-10 |
| Screenshots PNG estáveis | Pasta `docs/ag09-screenshots/` com roteiro; capturas visuais finais com AG-10 |

## Arquivos principais (AG-09)
- `src/pages/*` — Home, diagnóstico, resultado, briefing, AC, cluster, startup, regional
- `src/features/{interview,result,brief,ac,startup,regional,localState}/`
- `src/components/{Button,StatusBadge,DemoSeal,PersistenceStatus,GateChecklist,ScoreBreakdown}`
- `src/styles/pages.css`
- `src/services/*` — **temporários** até AG-07
- `src/app/router.tsx` — placeholders trocados pelas páginas reais
- Testes: `tests/app/routes.test.tsx`, `tests/services/matchingService.test.ts`, `tests/features/*`
- `README.md` atualizado; este handoff

### Ajustes mínimos fora do núcleo UI (desbloqueio build)
- Tipagem/`exactOptionalPropertyTypes` em `src/repositories/supabaseDemandRepository.ts` e teste associado (casts `unknown`)
- Lint em `unavailableDemandRepository` / `compositeDemandRepository` (assinaturas sem params mortos)

## Comandos executados
```bash
npm run check   # lint + test + build — OK
```
- **Lint:** OK  
- **Testes:** 16 arquivos / 76 testes OK  
- **Build:** `dist/` OK; `verify-spa-build` OK (sem `404.html`, sem segredos)

## Comportamento entregue
1. Landing com marca **DEMANDA** dominante + seletor de perspectiva (não é login)
2. Entrevista 5 etapas + revisão; atalhos cenário B / fixture A / C
3. Resultado A (score calculado, gates, evidências simuladas); B (sem score + briefing); C (pendências, sem INSERT)
4. Persistência: estados `local_draft` / `saving` / `synced` / `sync_failed`; “salvo na nuvem” só após sucesso real
5. Painel AC: merge seeds + remoto + sessão local, dedupe por UUID, contagem real, refresh
6. Cluster → chamada simulada → resposta startup tipada (`ResponseType`)
7. Painel regional agregado sintético
8. Reset local sem apagar banco; deep links nas rotas AG-02

## Pendências para AG-10
1. QA matriz A–K (incl. mobile 320px, teclado, zoom 200%, leitor de tela)
2. Substituir mocks `src/services/` pelo motor AG-07 quando handoff existir; regressão A=90, B inelegível
3. Validar G1S + INSERT/SELECT cross-browser; só então `remoteSharingEnabled` pode ser true
4. Deploy Cloudflare Pages + smoke deep-link refresh na URL real
5. Capturas oficiais em `docs/ag09-screenshots/` e `docs/QA_REPORT.md`
6. Bundle JS ~633 kB — considerar code-split se AG-10 exigir

## Como rodar
```bash
npm ci
npm run dev          # http://localhost:5173
# opcional: cp .env.example .env.local  (somente URL + publishable key)
npm run check
```

Roteiro rápido banca: Home → Preencher cenário B → Confirmar → Resultado B → Painel AC (Atualizar) → Cluster/chamada → Startup → Fixture A (90/100) → Regional.
