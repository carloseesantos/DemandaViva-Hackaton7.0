# HANDOFF — AG-10 QA / Release / Deploy

| Campo | Valor |
| --- | --- |
| Agente | AG-10 |
| Data | 2026-11-14 |
| Estado | **Release estático publicado**; remoto Supabase **não** ativado |
| URL | https://demanda-viva.pages.dev |
| Tag sugerida | `v0.1.0-rc1-static` |

## Arquivos editados / criados (escopo AG-10)

| Arquivo | Ação |
| --- | --- |
| `docs/QA_REPORT.md` | criado — matriz A–K, smoke, checklist |
| `docs/DEPLOY_PAGES.md` | criado — guia deploy + contingência |
| `docs/AG10_HANDOFF.md` | este handoff |
| `.env.example` | comentários; sem segredos; aviso Pages sem vars |
| `.gitignore` | ignora `.wrangler/` e `.cursor/` |
| `README.md` | URL confirmada + ponteiros QA/Deploy |

**Não tocados:** `src/services/*`, `src/domain/*`, repositórios, migrations (coordenação AG-07/08).

## Comandos

```bash
npm run check          # 91 testes + lint + build OK
npx wrangler pages deploy dist --project-name demanda-viva --branch main \
  --commit-hash "$(git rev-parse HEAD)" --commit-dirty=false
```

Projeto Pages `demanda-viva` criado via API Cloudflare; **zero** env vars `VITE_SUPABASE_*`. Tag: `v0.1.0-rc1-static`.

## Problemas

1. Alias `*.pages.dev` de deployment id pode ter SSL intermitente nos primeiros minutos; usar domínio curto.
2. D/H remotos e CT-10/12 **não executados**.

## Próximos (equipe / AG-11 / AG-00)

1. AG-11: gravar com URL acima; roteiro B→AC→A→Regional; sem claims remotos.
2. Push da tag/commit se a equipe quiser espelhar no remoto.
3. Não ligar Supabase sem G1S.
