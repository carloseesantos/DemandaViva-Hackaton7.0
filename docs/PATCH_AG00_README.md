# DEMANDA VIVA — PATCH DE INTEGRAÇÃO AG-04 + AG-05 + PMO

**Data-base:** 14/11/2026  
**Snapshot anterior:** `main` / `ee7b426e816c8827755328587721ec21b7272f04` (AG-02).  
**Escopo:** apenas arquivos novos/atualizados, com caminhos RELATIVOS À RAIZ do repositório.  
**Origem:** pacotes AG-04 e AG-05 no Google Drive + 7 documentos de governança AG-00 do Drive (checkpoint 1.2.0).

## Aplicar

No seu checkout do repositório `DemandaViva-Hackaton7.0`, faça backup/commit de alterações não enviadas e extraia **o conteúdo do ZIP diretamente na raiz** — não crie outra pasta `DEMANDA_VIVA_AG05` nem `AG-04_UX`. O ZIP tem `docs/`, `src/`, `tests/`, `.env.example`, `.gitignore` e `.node-version` diretamente no nível superior. Não extrair sobre outro projeto.

```bash
# estando na pasta do clone Git (raiz com package.json)
git status --short
unzip -o /caminho/DEMANDA_VIVA_PATCH_AG04_AG05_AG00_v1.2.0.zip
npm ci
npm run check
git status --short
git add docs src/data tests .env.example .gitignore .node-version
git commit -m "Integrate AG04 UX and AG05 demo catalog; sync PMO docs"
git push origin main
```

Se houver alterações concorrentes no repositório, **inspecionar diff antes de sobrescrever**. Não executar `git reset --hard` nem resolver conflitos automaticamente. A extração **não** faz push.

## Mapeamento

- AG-04: `docs/UX_FLOW.md`, `docs/ux/UX_FLOW.mmd`, `docs/ux/HANDOFF_AG04.md`.
- AG-05: `src/data/startups.ts`, `solutions.ts`, `catalog-enums.ts`, `evidences.ts` (re-export de compatibilidade); `docs/catalog/*` (matriz, enums, notas e handoff).
- Testes AG-05: `tests/scenarios.ts`, `tests/support/referenceMatcher.ts`, `tests/catalog.test.ts` — adaptado ao Vitest para rodar os cinco casos junto com `npm test`. O matcher auxiliar **não** é motor AG-07.
- PMO AG-00: sete documentos `docs/*.md` atualizados a partir do Drive, sem recriar contrato de dados.
- Correção ambiental AG-02: `.env.example`, `.gitignore`, `.node-version`, ausentes do snapshot Git/ZIP apesar de descritos no handoff. Nenhuma chave foi colocada.

## Arquivos deliberadamente NÃO incluídos

`src/domain/types.ts` do pacote isolado AG-05 (não sobrescrever AG-01), `package.json` e `tsconfig.json` isolados AG-05 (não sobrescrever AG-02), `node_modules/`, `dist/`, build privado, credenciais ou regras de matching de produção. O patch não cria seeds AG-06, backend, motor AG-07, Supabase AG-08 ou UI AG-09.

## Evidência/limite de validação

Os **5 casos de referência** do AG-05 foram executados com TypeScript 5.8.3 e Node 22.16.0 tanto no projeto isolado quanto substituindo seu `types.ts` pelo canônico AG-01/02; 5/5 PASS. Os casos cobrem A=90, B sem score, C, condicional D=72 e status expired/custo unknown. **Não são testes do AG-07**. A execução do `npm run check` do aplicativo com dependências instaladas precisa ser feita no clone do usuário em Node 22.22+ ou 24+; ambiente de auditoria não contém dependências completas. A integração/commit e aceite G2 dependem desse resultado e do handoff.

**Gates:** G1 aprovado; G2 **parcial** até verificar o patch no Git e o build; G1S **pendente** (decisão de INSERT/SELECT/antiabuso); G3–G6 ainda pendentes. AG-06 pode trabalhar após a publicação e validação do catálogo; AG-09 pode iniciar UX com mocks tipados após a validação do AG-04. Somente novas demandas finais fictícias podem ir ao Supabase após G1S.

As heurísticas e regras numéricas aqui são propostas internas para demonstração, **não critérios oficiais FACESP**. Os materiais são integralmente fictícios.
