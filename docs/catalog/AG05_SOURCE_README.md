# DEMANDA VIVA — AG-05 catálogo sintético (v1.0.0)

Pacote autocontido com **4 startups inventadas, 5 soluções inventadas e 9 evidências fictícias**, alinhado ao contrato `DATA_MODEL v1.0.0` aprovado pelo PMO em G1. **Não há startups, preços, integrações, pilotos ou validações reais**; todo conteúdo é exclusivamente para teste do hackathon.

## Integração

Copiar `src/data/startups.ts`, `src/data/solutions.ts` e `src/data/catalog-enums.ts` para o repositório da SPA React/Vite, preservando IDs. O arquivo `src/domain/types.ts` é apenas **espelho isolado** do contrato AG-01 para executar este pacote; no projeto, **não sobrescrever** `src/domain/types.ts` existente. O executor `tests/support/referenceMatcher.ts` serve aos testes locais e **não substitui o motor de produção AG-07**.

## Execução dos testes

Com `node >=20` e `typescript >=5.8` disponíveis: `npm test` (após `npm install`) ou `tsc -p tsconfig.json && node dist/tests/catalog.check.js`. Esperados: cinco PASS. Não precisa de credenciais, Supabase ou internet após instalação local das dependências.

## Arquivos e documentação

- `src/data/startups.ts` — startups e contatos simulados
- `src/data/solutions.ts` — soluções, evidências, suporte, cobertura e informações comerciais artificiais
- `src/data/catalog-enums.ts` — dicionário de apresentação dos códigos canônicos
- `docs/ENUM_DICTIONARY.md` — tipos/códigos do AG-01 e gates
- `docs/TRACEABILITY.md` — requisitos, soluções, gates, vigência e A/B/C
- `docs/UX_NOTES.md` — interface e avisos de demonstração
- `docs/HANDOFF_AG05.md` — integração com AG-07/09/10 e pendências
- `tests/` — fixtures e verificador algorítmico executável

## Fonte normativa dentro do projeto (não FACESP)

Docs 00–03, ADR-002 e DATA_MODEL do AG-01; pesos 30/20/20/15/15 e limites 80/65 são **propostas internas da equipe**, não critérios oficiais FACESP. Gates antes do score. Apenas demandas qualificadas e confirmadas podem ser gravadas remotamente — e só depois das decisões de segurança G1S.
