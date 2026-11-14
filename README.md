# DEMANDA VIVA

SPA demonstrativa do **Hackathon Connect 7.0 — Desafio FACESP**. Transforma dores do pequeno varejo em recomendações
justificáveis ou em oportunidades qualificadas para startups.

> **Demonstração com dados exclusivamente fictícios.** Trocar de perspectiva (Lojista / AC / Startup / Regional) **não é
> login nem autorização**. Aprovações e respostas são simuladas. Pesos, faixas e catálogo são propostas da equipe, não
> critérios oficiais da FACESP. A plataforma não gera software automaticamente.

**Estado atual:** SPA demonstrativa com motor AG-07, UI AG-09 e repositórios AG-08. Catálogo AG-05 e seeds AG-06
embarcados. Persistência: Composite (seeds + unavailable neste release); migration local em `supabase/migrations/`;
`remoteSharingEnabled=false` — **sem Supabase no deploy**. Release estático AG-10:

- **URL pública:** https://demanda-viva.pages.dev  
- Relatório: `docs/QA_REPORT.md` · Deploy: `docs/DEPLOY_PAGES.md`

## Stack

React 19 · TypeScript 6 (strict) · Vite 8 · React Router 8 · Vitest + Testing Library · ESLint 10 ·
Cloudflare Pages (estático) · Supabase Postgres (somente novas demandas qualificadas; código local pronto, **não**
aplicado remotamente até G1S + credenciais).

## Requisitos

- Node.js `^22.22` ou `>=24` (`.node-version` fixa 22 para o Cloudflare Pages)
- npm 10+

## Instalação e uso local

```bash
npm ci            # ou npm install
npm run dev       # http://localhost:5173
```

A SPA funciona **sem Supabase**. Nesse modo, exibe "Modo offline: novas demandas não serão compartilhadas entre navegadores."

### Variáveis de ambiente (opcional)

```bash
cp .env.example .env.local
```

Preencha **apenas** `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` (chave publicável). Nunca use `service_role`,
`sb_secret_…` ou connection string. Tudo com prefixo `VITE_` vai para o bundle público. Uma chave secreta é recusada em
runtime, e o build falha se detectar segredo em `dist/`.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento Vite |
| `npm run build` | `tsc -b` + `vite build` → `dist/` + `scripts/verify-spa-build.mjs` |
| `npm run preview` | Serve `dist/` localmente |
| `npm run lint` | ESLint, incluindo fronteiras entre camadas |
| `npm test` | Vitest (unitários e guardas de segredo/PII) |
| `npm run typecheck` | Checagem de tipos sem emitir |
| `npm run verify:spa` | Só a verificação pós-build (`dist/index.html`, ausência de `dist/404.html`, sem segredos) |
| `npm run check` | lint + test + build |

## Estrutura

```text
src/
  app/            composition root: router, layout, env, injeção de dependências (AG-02)
  domain/         types.ts = contrato DATA_MODEL v1 (AG-01); regras puras (AG-07)
  services/       serviços determinísticos para a UI (AG-07)
  data/           fixtures SINTÉTICAS embarcadas: catálogo (AG-05), ACs/seeds/cenários (AG-06)
  repositories/   adaptadores DemandRepository: seeds, Supabase, composite (AG-08)
  pages/ features/ components/   UI (AG-09)
  styles/         brand-tokens.css (AG-03) + base.css
tests/            espelha src/ por camada; fixtures só de teste em tests/fixtures/
supabase/migrations/   SQL versionado (AG-08); setup manual em supabase/README.md
public/brand/     logo e favicon (AG-03)
docs/             governança, contrato, arquitetura, AG08_SECURITY_G1S
```

Cada pasta tem um `README.md` com dono e regras. Fixtures de `src/data/` vão para o bundle público e devem ser
fictícias. Dados reais de clientes nunca entram no repositório. Existência de arquivos SQL **não** significa projeto
Supabase configurado.

## Publicação no Cloudflare Pages

**Deploy AG-10 realizado (estático, sem Supabase):** https://demanda-viva.pages.dev  

Detalhes, re-deploy e contingência: `docs/DEPLOY_PAGES.md`. Evidências: `docs/QA_REPORT.md`.

### Via upload direto (Wrangler) — método usado

```bash
npm run check
npx wrangler pages deploy dist --project-name demanda-viva --branch main
```

**Não** configurar `VITE_SUPABASE_*` no Pages neste MVP. Opcional local: `NODE_VERSION=22` (já em `.node-version`).

### Rotas profundas (deep links)

Sem `404.html` na raiz de `dist/`, o Pages serve `index.html` para caminhos sem arquivo (`/ac/painel` recarrega).
`npm run build` falha se `dist/404.html` aparecer. Validado na URL pública (HTTP 200).

## Documentação

- `docs/PROJECT_CONTEXT.md`: contexto e escopo
- `docs/DATA_MODEL.md`: contrato de dados v1.0.0 (aprovado)
- `docs/DECISIONS.md`: decisões e pendências
- `docs/ARCHITECTURE.md`: C4 lógico, fronteiras e decisões técnicas
- `docs/AGENTS.md`, `docs/TASKS.md`, `docs/HANDOFF_AND_RISKS.md`: governança
- `AG-03_BRAND/`: identidade visual Ponte Viva
