# `supabase/` — migrações e testes de política (AG-08)

**Nenhuma migração foi criada ou aplicada pelo AG-02.** O DDL proposto está em `docs/DATA_MODEL.md` §7
(`public.demo_demands`), sujeito à revisão do AG-08 e à decisão G1S (Auth Anonymous, antiabuso, projeção/RPC de leitura).

- `migrations/` — arquivos versionados, ex.: `20261114_001_demo_demands.sql`. Nunca alterar o schema só pelo dashboard.
- Credenciais (service_role, connection string) **nunca** entram no repositório nem em variáveis `VITE_*`.
