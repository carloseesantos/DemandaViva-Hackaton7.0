# `supabase/` — migrações e setup (AG-08)

**Status:** arquivos locais versionados. **Nenhum projeto Supabase foi provisionado nem migration aplicada** a partir deste workspace.

## Conteúdo

| Caminho | Descrição |
| --- | --- |
| `migrations/20261114_001_demo_demands.sql` | DDL `public.demo_demands` + CHECKs + indexes + RLS/GRANTs restritivos (select/insert próprios). |
| — | RPC cross-browser **não** incluída; ver `docs/AG08_SECURITY_G1S.md`. |

## Setup manual (credenciais e migração)

Etapas para um humano com acesso ao dashboard (não automatizadas aqui):

1. Criar projeto Supabase de **demo** (Free tier ok; anotar pausas do free tier).
2. **Authentication → Providers → Anonymous Sign-Ins**: habilitar.
3. **Antiabuso:** em Auth, habilitar **CAPTCHA (Cloudflare Turnstile)** com chaves no painel Supabase (segredo **nunca** em `VITE_*` nem no repo).
4. SQL Editor (ou CLI): aplicar **somente** `migrations/20261114_001_demo_demands.sql` em ambiente de desenvolvimento primeiro.
5. Copiar **Project URL** e chave **publishable** / anon legada → `.env.local`:

   ```bash
   cp .env.example .env.local
   # VITE_SUPABASE_URL=https://xxxx.supabase.co
   # VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…   # ou JWT anon
   ```

6. Rodar testes negativos de RLS (CT-10) antes de qualquer URL pública.
7. **Não** liberar RPC de listagem cross-browser até deliberação **G1S**.

## Segurança

- Nunca `service_role`, `sb_secret_*` ou connection string no frontend / `VITE_*`.
- Sem UPDATE/DELETE para visitantes na migration 001.
- Seeds AG-06 **não** são importadas para o banco.

## Fallback

Sem projeto, sem migration aplicada ou sem Turnstile/G1S: SPA + seeds locais; `remoteSharingEnabled=false`; ver parecer em `docs/AG08_SECURITY_G1S.md`.
