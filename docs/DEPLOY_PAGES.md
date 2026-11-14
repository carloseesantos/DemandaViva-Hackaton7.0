# Deploy Cloudflare Pages — DEMANDA VIVA (AG-10)

## Objetivo do release estático (PEND-RELEASE-LOCAL-001)

SPA React/TS/Vite publicada **sem** integração Supabase ativa:

- Build: `npm run build` → saída `dist/`
- **Não** definir `VITE_SUPABASE_URL` nem `VITE_SUPABASE_PUBLISHABLE_KEY` no Pages
- `remoteSharingEnabled` permanece `false` no código (G1S aberto)
- Cenários A/B/C, seeds e catálogo fictícios continuam locais

## Projeto Pages (confirmado)

| Campo | Valor |
| --- | --- |
| Conta Cloudflare | autenticada (MCP + Wrangler OAuth) |
| Projeto | `demanda-viva` (Direct Upload) |
| URL de produção | **https://demanda-viva.pages.dev** |
| Env vars Production/Preview | **nenhuma** (sem `VITE_SUPABASE_*`) |
| Release | tag `v0.1.0-rc1-static` (AG-07 motor + AG-10 QA/deploy) |

## Comandos usados neste release

```bash
npm ci   # se ambiente limpo
npm run check
npx wrangler login   # se ainda não autenticado
npx wrangler pages deploy dist \
  --project-name demanda-viva \
  --branch main \
  --commit-hash "$(git rev-parse HEAD)" \
  --commit-message "AG-10 static release candidate without Supabase" \
  --commit-dirty=true
```

Criação inicial do projeto (API / equivalente Dashboard):

- Nome: `demanda-viva`
- Production branch: `main`
- Sem source Git obrigatório (Direct Upload)
- Sem variáveis de ambiente

## Configuração Git (alternativa futura)

Se a equipe preferir CI Git depois:

1. Workers & Pages → Create → Pages → Connect to Git
2. Build command: `npm run build`
3. Output directory: `dist`
4. Node: `.node-version` = 22
5. **Não** adicionar `VITE_SUPABASE_*` até G1S + decisão explícita
6. Validar deep-link `/ac/painel` → HTTP 200 + SPA shell

> Nota: projeto Direct Upload **não** migra para Git integration; seria outro projeto.

## Deep links (SPA)

Não versionar `404.html` na raiz de `dist/`. O Pages serve `index.html` para caminhos sem arquivo. `scripts/verify-spa-build.mjs` falha se `404.html` aparecer.

Teste local:

```bash
npm run build
npx wrangler pages dev dist --port 8788
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8788/ac/painel
```

## Contingência (plano B)

Se Pages ficar indisponível na gravação:

1. `npm run preview` ou `npm run dev` em localhost
2. Usar capturas `docs/ag09-screenshots/`
3. Declarar no pitch que a URL pública não está sendo usada naquele momento
4. Não inventar URL alternativa

## Re-deploy

Após commit consolidado AG-07 + docs:

```bash
npm run check
npx wrangler pages deploy dist --project-name demanda-viva --branch main \
  --commit-hash "$(git rev-parse HEAD)" \
  --commit-message "demanda-viva release" \
  --commit-dirty=false
```

Continuar **sem** vars Supabase até liberação G1S.
