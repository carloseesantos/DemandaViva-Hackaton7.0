# DEMANDA VIVA — DECISIONS / ADR REGISTER


> **Baseline:** 1.1.0 | **Emissão:** 2026-11-14 | **Guardião:** AG-00 | **Regra:** registrar decisões vigentes, propostas, conflitos e solicitações **sem alterar a decisão aprovada**. A validação formal da equipe não pode ser inferida de um documento rotulado “proposta”.


## ATUALIZAÇÃO PMO 1.1.0 — Decisões da equipe em 14/11/2026


**Evidência decisória:** responsável pelo projeto informou nesta conversa que o modelo de dados AG-01 foi aprovado pela equipe e que a primeira opção visual recomendada pelo AG-03 foi selecionada. Essa confirmação não se confunde com ata ou endosso institucional da FACESP. Os handoffs foram escritos antes dessas aprovações; menções a 'pendente' neles refletem o instante da emissão.


| ID | Estado atual | Evidência / efeitos |
|---|---|---|
| **DEC-APP-G1-20261114** | **APROVADO:** DATA_MODEL.md AG-01 v1.0.0 como contrato canônico G1, incluindo QualifiedNeed final, NeedDraft local, campos, enums, mapeamento, A/B/C, seeds e versionamento. | [DATA_MODEL.md](https://drive.google.com/file/d/1vNF2QbKs30x9aNeGqGpCz-txru4OxnaQ/view). Libera AG-02, AG-04 final e AG-05; AG-06 prepara cenários, com fixtures finais dependentes de AG-05. Não há SQL aplicado ou testes de integração. |
| **DEC-BRAND-003** | **APROVADA:** direção 01 Ponte Viva recomendada pelo AG-03; marinho #11273A, petróleo #075E6B, verde-água #25BAA7, Manrope e assets associados. Naming Demanda Viva e ênfase DEMANDA preservados. | [BRAND_SYSTEM.md](https://drive.google.com/file/d/1TYfIBbUIDPgJfAGFDYDKuGduzYxSJJaJ/view) e [pacote AG-03](https://drive.google.com/drive/folders/1xy3wChZPRtt7XYr2YZRauVE3IVwOjRUs). Libera aplicação visual em UX, frontend e pitch provisório; QA final ainda pendente. |
| **DEC-G1S-STATUS** | **PENDENTE:** autenticação anônima, controles efetivos de abuso, política SELECT de dados fictícios em outra sessão, projeção/RPC, limites e retenção. | A aprovação do contrato lógico NÃO aprova publicação de endpoint remoto ou leitura pública. Equipe + AG-08 devem deliberar e testar; bloquear INSERT/SELECT público até G1S. |


**Pendências reinterpretadas:** PEND-01 resolvida no contrato G1 (somente ficha final, sem transcrição remota); PEND-04 aprovada como desenho de campos/validações, mas SQL, antiabuso e controles de PII seguem abertos; PEND-10 resolvida apenas quanto à **direção visual**. O slogan 'Necessidades que viram oportunidades.' continua referência recomendada, não oficializado. PEND-02, PEND-03, PEND-09 e demais temas não foram decididos por implicação. DEC-DATA-004/005 do AG-01 seguem propostas de SEGURANÇA G1S, não permissões públicas aprovadas.


**Precedência de leitura:** este checkpoint atualiza os estados históricos listados abaixo, sem apagar decisões anteriores; a ADR-002 continua prevalecendo sobre a ADR-001 somente em persistência. Nenhuma atividade de software foi declarada concluída.


## 1. Semântica dos estados


- **Aprovada pela equipe:** fonte documental registra aprovação explícita.
- **Diretriz vigente neste briefing:** o responsável pelo projeto indicou o curso obrigatório para esta execução; eventual ata ou aceite colegiado formal **não localizado**.
- **Proposta / hipótese:** texto de fonte interna usado como baseline de trabalho, ainda passível de validação; não equivale a norma FACESP.
- **Pendente:** decisão que precisa de dono, opção, critérios e evidência de aprovação antes de determinada implementação.
- **Obsoleta parcialmente:** item anterior superado em um tema específico, preservado no restante.


## 2. Registro consolidado


| ID / tema | Regra ou posição atual | Estado / força | Evidência e observação |
| --- | --- | --- | --- |
| **DEC-BRAND-001 — Naming** | Nome oficial **DEMANDA VIVA** substitui ORÁCULO MATCH; **DEMANDA** com maior ênfase | **Aprovada pela equipe** | Doc 00, item 10, 14/11/2026; não alterar sem nova aprovação |
| **DEC-BRAND-002 — Slogan** | “Necessidades que viram oportunidades.” | **Recomendação**, não aprovação final de identidade | Doc 00; AG-03 apresenta direções sem mudar naming |
| **DEC-PROD-001 — Proposição de valor** | Diagnosticar dor, recomendar solução elegível OU produzir briefing, consolidar relatos e abrir oportunidade a startups; sistema **não cria software** | **Diretriz de produto consolidada** | Docs 00/01/03 e briefing do projeto |
| **DEC-PROD-002 — Três saídas** | A match elegível; B sem match elegível **no catálogo**; C dados insuficientes, jamais confundido com B | **Diretriz de produto consolidada** | Docs 01/02/03/07 |
| **DEC-ARCH-001 — SPA e Cloudflare** | React + TypeScript + Vite, SPA no Cloudflare Pages; `npm run build` e `dist`; sem API Node própria | **Diretriz vigente do briefing**; na ADR-001 era recomendação técnica | ADR-001 e instrução explícita atual; instalação e URL ainda **não evidenciadas** |
| **DEC-ARCH-002 — Persistência híbrida** | Catálogo/regras/4 seeds **locais**; **somente novas demandas qualificadas** no Supabase Postgres via Data API | **Diretriz vigente do briefing**, fundamentada na **ADR-002** | ADR-002 foi redigida como “proposta”; o briefing atual determina precedência sobre ADR-001 quanto a persistência. Aprovação formal em ata não localizada |
| **DEC-ARCH-003 — Precedência entre ADRs** | ADR-002 prevalece sobre ADR-001 **somente** no tema armazenamento remoto; demais recomendações compatíveis da ADR-001 permanecem | **Diretriz vigente explícita** | Instrução atual + ADR-002 item 1. Não reverter a SPA para 100% local |
| **DEC-DATA-001 — Sintéticos e local/remote** | Seeds, soluções, ACs e respostas fictícias; não coletar PII, não importar seeds para banco por padrão; a AC visual não é autenticada | **Diretriz vigente** | ADR-002 itens 2,3,7; fontes 01/07 |
| **DEC-MATCH-001 — Elegibilidade** | Filtros eliminatórios sempre **antes** de score; falha obrigatória = inelegível sem score | **Diretriz de produto** | Doc 02 itens 5–9; confirmado no plano 07 |
| **DEC-MATCH-002 — Pesos e limites** | Pesos **30/20/20/15/15**, nota 0–5; 80–100 recomendado após AC, 65–79 condicional, abaixo de 65 não recomendar | **Proposta da equipe**, NÃO regra oficial FACESP | Doc 02 item 6; manter como hipótese inicial até validação, sem mudar silenciosamente |
| **DEC-TEST-001 — Cenários fundamentais** | A: ERP X + EstoquePonte = **90/100 calculado**; B: sem ERP X = **incompatível e sem score**; C: ficha incompleta | **Exemplos e testes sintéticos definidos para MVP** | Docs 02/05/07; teste executado ainda não evidenciado |
| **DEC-SEED-001 — Recorrência** | 4 relatos fictícios de **2 ACs** no cluster demonstrativo sem ERP, distintos de A com ERP X | **Diretriz de demonstração** | Docs 03/06/07; cluster revisável; contagem real após merge |
| **DEC-GOV-001 — Aprovação humana** | AC avalia diagnóstico/match/briefing e chamadas; startup decide proposta e eventual piloto | **Modelo funcional de governança** | Docs 01/03; **no P0, ações AC/startup só simuladas** |
| **DEC-SEC-BASE — Fronteiras de segurança** | URL e chave Supabase publicável no SPA; **nunca** secret/service_role; RLS + GRANTs; dados puramente sintéticos; negar UPDATE/DELETE visitante | **Regra de segurança mandatória do briefing** | ADR-002 item 7; implementação e testes ainda não comprovados |
| **DEC-DEMO-001 — Fallback** | Site, catálogo e seeds continuam sem Supabase; sem falsa mensagem de sincronização; reset só local | **Diretriz vigente** | ADR-002 item 8, plano 07 |
| **DEC-DOC-001 — Integração** | `DATA_MODEL.md` **aprovado** bloqueia fixtures finais e implementações; handoff obrigatório; agente não assume acesso a repo/Drive | **Diretriz operacional vigente** | Plano 07 e pedido AG-00 |


### Nota de rastreabilidade sobre aprovação


O cabeçalho da **ADR-001** diz “recomendação técnica para validação da equipe”; o da **ADR-002** diz “proposta v1.0 para deliberação”. Esta consolidação **não reclassifica retroativamente ambas como atas aprovadas**. A execução atual trata React/Vite/Pages + persistência seletiva Supabase como **instruções vigentes do projeto**, por determinação expressa no briefing. A equipe deve formalizar eventuais deliberações adicionais. A fonte 04 (slides C4) descreve contêineres conceituais anteriores e pode conflitar com o MVP híbrido; não serve como contrato implementado.


## 3. Questões abertas com dono e gate


| ID | Questão específica | Opções / recomendação documentada (não aprovação) | Quem decide | Bloqueia |
| --- | --- | --- | --- | --- |
| **PEND-01** | Persistir apenas ficha qualificada ou também mensagens? | ADR-002 recomenda **somente ficha final**; conversa/rascunho local | Equipe + AG-01 | G1, contrato final, US-10 |
| **PEND-02** | Política real de INSERT público no Supabase | Auth Anonymous com owner_id e RLS; proteção efetiva contra abuso com CAPTCHA/Turnstile, limites ou rota protegida equivalente. Não permitir GRANT/RLS irrestritos | Equipe + AG-08/01 | **G1S, AG-08, US-10/12** |
| **PEND-03** | Política de SELECT de novos registros | Exibir apenas **projeção sintética mínima**; sem autenticação da AC, leitura pública não é autorização institucional; definir colunas/status/controle | Equipe + AG-08 | **G1S, US-11/12** |
| **PEND-04** | Sanitização/validação do input | Campos categóricos, resumo curto controlado, limites SQL e filtragem anti-PII; texto livre condicionado | Equipe + AG-01/08 | G1, G1S |
| **PEND-05** | Critérios de curadoria de soluções | Evidência mínima, prazo de validade, responsável pela curadoria e revisão | Equipe com AC/FACESP futuramente; AG-05 propõe | G1/G2 catálogo, recomendações |
| **PEND-06** | Cluster mínimo para abrir chamada e permissões entre ACs | Não inventar mínimo oficial; permitir chamada individual somente conforme regra aprovada; autorização de compartilhamento | Equipe e ACs responsáveis | US-08/09, pitch institucional |
| **PEND-07** | Quem opera, aprova e acompanha pilotos? | AC local, regional/FACESP e startup têm papéis propostos no Doc 01, mas delegação operacional real não definida | Equipe com rede | Operação real/P1; simulação P0 pode seguir com ressalva |
| **PEND-08** | Faixas/ponderação do matching definitivas? | Manter 30/20/20/15/15 e thresholds como **proposta para demo**, depois validar com lojistas/ACs | Equipe + AG-01/07 | Mudanças no motor; não impede demo com rótulo propositivo |
| **PEND-09** | Quantidade de startups/soluções para fixtures | Doc 07 pede **3–5 startups / 4–6 soluções**; ADR-001 propôs mínimo **2–3 soluções**. Adotar escopo final após alinhamento, sem expandir por conta própria | Equipe + AG-05/00 | G2 fixtures; pode executar escopo Doc 07 após aprovação |
| **PEND-10** | Identidade visual final e slogan | Naming está decidido; cores tipográficas/logo/tokens/slogan ficam para proposta AG-03 e aprovação da equipe | Equipe + AG-03 | UI final e pitch visual |
| **PEND-11** | Repositório, acesso Cloudflare e projeto Supabase | Confirmar endereços, responsáveis e permissões sem publicar credenciais privadas em documentos | Equipe + AG-02/08/10 | Scaffold, testes remotos e deploy |
| **PEND-12** | Política de limpeza/retenção de dados fictícios | Planejar limpeza sem apagar seed nem comprometer demos; limites e mecanismos de retenção de registros remotos | Equipe + AG-08/10 | Publicação remota e ensaio seguro |
| **PEND-13** | Política de abertura/visibilidade de briefings para startups | Chamada pública x dirigida; minimização/consentimento; sem fluxo real no P0 | Equipe + AG-04/09 | P1 real; conteúdo da demo deve ser explícito |
| **PEND-14** | Aprovação final da baseline produzida por AG-00 | Revisar seis arquivos, resolver divergências e aprovar versão para espelhamento no repo | Equipe + AG-00 | Aceite formal G0, integração de documentação |


## 4. Conflitos documentais tratados sem mudança de produto


1. **ADR-001 vs ADR-002:** a primeira recomendava nenhuma persistência remota, a segunda prevê Supabase para novas demandas. Aplicada **a precedência expressa** do briefing apenas no armazenamento; SPA/Cloudflare e catálogo fictício local persistem.
2. **Slides C4 04 vs arquitetura do MVP:** os slides representam papéis, camadas e armazenamento conceituais que não garantem instância real, autenticação ou backend; AG-02/08 devem documentar a arquitetura implementada sem fingir que já existe.
3. **ADR-001 vs Doc 07 sobre catálogo:** mínimo de 2–3 soluções contra plano posterior de 4–6 e 3–5 startups. Registrar PEND-09, mantendo coerência A/B sem permitir candidato que invalide o não match.
4. **Cenário A vs cluster de quatro lojas:** A **usa ERP X** e obtém match; cluster demonstrativo do Doc 03 é de lojas **sem ERP**, que precisam de alternativa. Não unir os contextos para forçar consistência de seed.
5. **Propostas de matching vs regras FACESP:** pesos/thresholds/status de curadoria são hipóteses da equipe. A apresentação não deve atribuí-los à entidade do desafio.
6. **AC em interface vs autorização real:** ações de AC/startup e regional são simulações de produto; Supabase é usado apenas para novas demandas sintéticas. RLS de banco não consegue identificar AC real sem identidade/autorizações genuínas.


## 5. Como registrar nova decisão (sem retroagir)


```text
DEC-AAAA-NNN — TÍTULO
Data/Hora e proponente:
Estado: proposta | aprovada pela equipe | rejeitada | substituída
Contexto e problema:
Alternativas consideradas e riscos:
Decisão EXATA e escopo:
Aprovação: nome/registro/link da evidência:
Documentos/contratos afetados:
Data efetiva e migração necessária:
Relação com ADR anterior (se aplicável):
```


**Regra de mudanças:** AG-00 não redefine pesos, governaça institucional, arquitetura ou permissões. Ao receber proposta de agente, identifica impacto, solicita aprovação humana, atualiza o log e só então libera atualização coordenada em backlog/contrato/código/UX. Sem evidência de aprovação, status permanece **pendente**.


## 6. Documentos de origem


- [00 — Decisão de marca](https://docs.google.com/document/d/1-upBHWiSTfwP_OyulOwvbBVDpSihy5q26Ifm7lQBIPI/edit)
- [01 — Governança](https://docs.google.com/document/d/1eNfgWeacmydoMVFgFdBkgJ0r9f02Fat_evxuhO-3vD0/edit)
- [02 — Matching](https://docs.google.com/document/d/1xyL8GIgOnLyxTCSpW5QA4BOYtX5znVo845DUSlYIT-M/edit)
- [03 — Briefings e chamadas](https://docs.google.com/document/d/119AhX_y2nUfuuZ9THB83PnCDWK2XCBVTgCG8KLKCLGI/edit)
- [04 — C4 conceitual](https://docs.google.com/presentation/d/1hZDbqhepboco73rFqeDbJfc2Q0qkhWM4SW-rMFwV2p4/edit)
- [05 — ADR-001](https://docs.google.com/document/d/1Zfa-k_rH_BYU6NCjXweql12Pkztk_lpYCRksqlBIF28/edit)
- [06 — ADR-002](https://docs.google.com/document/d/1vO34lMSNB95qUw5cjZLHje2WDyHb9XMkOaLNl1ZS0jM/edit)
- [07 — Plano de agentes](https://docs.google.com/document/d/1v9DjGvdYMEfphBo36xzvCPIGYN1AFp47QjCACCF1pbY/edit)