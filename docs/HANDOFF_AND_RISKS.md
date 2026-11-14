# DEMANDA VIVA — HANDOFF UNIVERSAL E REGISTRO DE RISCOS


## CHECKPOINT HANDOFF & RISKS 1.5.0 — release final


**Pacote verificado:** [commit 916b3d6](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/916b3d6ee715c67714930c356552f91523784d4a) com [AG08_HANDOFF.md](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/blob/main/docs/AG08_HANDOFF.md), [AG08_SECURITY_G1S.md](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/blob/main/docs/AG08_SECURITY_G1S.md) e [AG09_HANDOFF.md](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/blob/main/docs/AG09_HANDOFF.md); 8 hashes Git blob iguais aos arquivos do ZIP no Drive. **76 testes/lint/build** documentados no handoff, não teste reexecutado pelo PMO.


| Risco | Estado e mitigação sob prazo |
|---|---|
| **R-01/R-02/G1S — CRÍTICO ABERTO** | SQL apenas local, Auth Anonymous sem Turnstile não previne abuso, RLS owner-only não autoriza segunda sessão; sem projeto testado/RPC. **Não ativar remoto**; usar SPA local-only com aviso honesto. |
| **R-04 — motor provisório** | AG-09 inclui `src/services` temporários, com A/B/C úteis, mas não homologa domínio AG-07. **AG-07 substituir e testar interfaces, AG-10 regressão**. |
| **R-05 — falso cluster** | Seeds/merge com mock presentes; verificar clusters por problema/processo/restrições e rejeitar D de mesmo texto, revisão simulada. |
| **R-07 — deploy e rota profunda** | Cloudflare Pages ainda não comprovado; AG-10 validar URL HTTPS em janela anônima, refresh de todas rotas, responsividade, secrets. Plano B: gravação SPA local/PNG. |
| **R-14 — janela até 21h** | **Crítico de execução**: reduzir escopo para fluxo A/B/C/cluster estático, motor canônico, QA e gravação. Não gastar janela em Supabase não homologado, P1, CSS perfumaria ou code-split não essencial. |
| **NEW-R19 — edição simultânea** | AG-07 deve tomar ownership de `src/services`; AG-10 não editar esses arquivos até handoff, para não perder alterações; Git status, commit único e rollback versionado. |
| **NEW-R20 — demonstração confundida com persistência** | Avisos de simulação e estado `remoteSharingEnabled=false`; não anunciar quinta demanda remota, login real, validação por AC/FACESP ou chamada efetivamente enviada. |


**Liberação de próximo ciclo:** AG-08 concluído como adaptação local; AG-09 concluído para demo navegável; AG-07 liberado urgentemente; AG-10 liberado preparar QA/deploy estático em paralelo e finalizar após AG-07; AG-11 gravação provisória/final depois de URL ou plano B. Sem alegação de G1S fechado ou release publicado.






## CHECKPOINT DE HANDOFFS E RISCOS 1.4.0 — AG-06 entregue, AG-08/09 em curso — 14/11/2026




**Entregas verificadas:** [AG-06 commit 89c6265](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/89c626593ff7ec6a5b90b7bdf59f0baf1977ef39), [fix de teste bd82bcb](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/bd82bcb1c3bf51d7ead8ae9fea97e683afd8e32a), [AG06_HANDOFF.md](https://drive.google.com/file/d/1V9Yxe6Ta4NX-uzBKQhWiQzkoSAuhpghC/view), [ZIP atualizado](https://drive.google.com/file/d/1OslrqHYazOEYfNrpl_o42f6HUvud5UMI/view). **Seis** arquivos AG-06 conferidos por Git blob SHA-1. Entrega aceita documentalmente/estruturalmente: 4 seeds/2 ACs, A/C separados, D/E de teste e 9 casos em Vitest. **Não há prova de execução de `npm run check` após AG-06, QA do motor AG-07, SQL Supabase nem deploy.**




| Risco/bloqueio | Estado 1.4.0 | Dono e tratamento |
|---|---|---|
| **R-03 — drift de contrato** | Mitigação estrutural: commit AG-06 adiciona dados/testes sem alterar `src/domain/types.ts`. Compilação do HEAD ainda não demonstrada. | AG-06/AG-07/AG-10: reexecutar `npm run check` no HEAD e checar tipagem. |
| **R-04 — falso match** | **ABERTO**: 9 testes AG-06 verificam `referenceMatcher`; AG-07 real ainda não entregue. E é variante a R$ 299 só em testes; catálogo permanece R$ 199. | AG-07: gates antes de score, A 90, B sem score, C vazio, D privacidade, E budget. |
| **R-05 — falso cluster/contagem** | **PARCIALMENTE MITIGADO**: quatro seeds UUID estáveis/duas ACs/um bucket candidato. Segundo estágio/conflict analysis, merge remoto e contagem cross-browser ainda pendentes. | AG-07/08/09/10: cluster revisável, dedupe por UUID e contagem real sem hardcode. |
| **R-01/R-02 — G1S** | **CRÍTICO/ABERTO**: AG-08 está em execução no Cursor segundo equipe, mas não há parecer aprovado nem testes de RLS/GRANTs/antiabuso/SELECT. | AG-08 + equipe: decidir e validar antes de abertura pública. |
| **R-07 / release** | **ABERTO**: AG-09 está em execução; deploy e QA não evidenciados. | AG-10: QA profundo, Cloudflare URL pública real e smoke. |
| **NEW-R18 — colisão de agentes Cursor** | **MÉDIO/ABERTO (preventivo)**: AG-08 e AG-09 operam em paralelo e AG-07 pode ser iniciado; risco de alteração concorrente dos mesmos repositórios/serviços. | Equipe/Cursor: separar branches/arquivos, manter `src/domain/types.ts` congelado, integrar apenas com review/handoff; não sobrescrever commits. |




**Liberações:** AG-06 **CONCLUÍDO e aceito para consumo**. AG-07 **LIBERADO tecnicamente**, não iniciado com evidência; coordenar integração com AG-08/09 já em execução. AG-10 bloqueado até receber entrega e testes. G2 exige check pós-AG06 para fechamento técnico; G1S aberto e crítico. Handoffs antigos continuam como histórico abaixo.












## CHECKPOINT DE HANDOFFS E RISCOS 1.3.0 — 14/11/2026








**Evidência da rodada:** [Git main 31481ad](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/31481ad9b1e25b44e0b03b225a4794c3ea1d416a) e [ZIP do Drive atualizado](https://drive.google.com/file/d/1OslrqHYazOEYfNrpl_o42f6HUvud5UMI/view), com SHA de cinco blobs coincidentes; capturas de `npm run check`: ESLint OK, **36 testes/6 arquivos OK**, `tsc -b && vite build` OK, `verify-spa-build: OK`; `git status` main sincronizada e dois diretórios untracked locais.








| Risco/Bloqueador | Estado atualizado/causa | Mitigação/dono |
|---|---|---|
| **NEW-R15 / setup** | **RESOLVIDO quanto ao versionamento**: `.env.example`, `.gitignore`, `.node-version` agora constam no Git/ZIP. | AG-02 entregue. AG-10 fará nova revisão na release. |
| **NEW-R16 / entrega AG-04/05** | **RESOLVIDO quanto à publicação**: `UX_FLOW.md`/handoff e catálogo/docs/teste AG-05 constam da main e do ZIP. | AG-06 e AG-09 podem consumir; testes de integração AG-07/09/10 permanecem pendentes. |
| **NEW-R17 / artefatos locais não rastreados** | **BAIXO/ABERTO**: `.cursor/` e `.wrangler/` identificados no `git status`, sem alterações rastreadas. | Equipe/AG-02: manter `.wrangler/` fora do repositório; avaliar regras compartilháveis em `.cursor/` antes de ignorar; não incluir segredos. |
| **R-04, R-05** | **ABERTOS**: os cinco testes AG-05 avaliam `referenceMatcher`, **não** o motor definitivo nem seeds AG-06; `seed-demands.ts` ausente. | AG-06 entrega seeds/contraprovas; AG-07 implementa gates/score/briefing/cluster com testes próprios. |
| **R-01/R-02 — G1S** | **CRÍTICOS/ABERTOS**: política INSERT/SELECT, RLS/GRANTs e antiabuso ainda não deliberados nem testados. | AG-08 apresenta proposta à equipe; proibir exposição pública até deliberação e testes negativos. |
| **R-07** | **ABERTO**: não há URL Cloudflare Pages verificada; build local não comprova publicação. | AG-10 na rodada de release. |








**Handoffs aceitos para próximo ciclo:** AG-02 scaffold; AG-04 especificação UX; AG-05 catálogo sintético. **Handoffs pendentes:** AG-06, AG-07, AG-08, AG-09, AG-10. **G2 parcial até AG-06**. A aceitação operacional da PMO não se confunde com validação de usuários ou anuência institucional FACESP.








**Próximos disparos:** AG-06 fixtures finais, AG-09 telas com mocks, AG-08 parecer G1S em paralelo; AG-07 após AG-06; AG-10 após integrações. Riscos antigos de 1.2.0 permanecem como histórico temporal.
























## REGISTRO PMO 1.2.0 — auditoria de entrega AG-02 e bloqueios AG-04/05 (14/11/2026)
















**Evidências:** [ZIP/handoff AG-02](https://drive.google.com/drive/folders/11CWoPsdT2MmPBx_zA2qN4SRabXdcpYB0) e [commit main ee7b426](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/ee7b426e816c8827755328587721ec21b7272f04). Base React/TS/Vite e fronteiras do AG-02 são versionadas; 31 testes, build, lint e rotas 200 foram **relatados no handoff**, não reproduzidos independentemente (Node de auditoria 22.16 é incompatível com mínimo 22.22 e npm offline sem dependências completas). Não há URL de Pages, Supabase, migrações aplicadas ou smoke público.
















| Registro | Severidade e estado | Dono / remediação |
|---|---|---|
| **NEW-R15 — Configuração de repositório incompleta** | **Alto/aberto:** `.gitignore`, `.env.example`, `.node-version` citados em AG-02/README não aparecem no commit/ZIP; risco de secrets/build e instruções quebradas. | AG-02: verificar arquivos ignorados, publicar sem segredos, reexecutar lint/test/build e corrigir setup. AG-10 audita depois. |
| **NEW-R16 — Entregas AG-04/05 fora do snapshot Git** | **Alto/aberto para G2:** equipe informa execução, mas não há arquivos canônicos/handoffs na main auditada; integração produziria mocks/fixtures inconsistentes. | AG-04: `docs/UX_FLOW.md` + `docs/ux/`; AG-05: `src/data/startups.ts`, `solutions.ts`, `evidences.ts`, `docs/catalog/`. AG-00 valida após commit. |
| **R-07/BLK-05** | **ABERTO:** Wrangler local não comprova Pages remoto. | AG-10 + equipe: login e URL pública, smoke HTTPS/refresh. |
| **R-01/R-02, BLK-02/03 G1S** | **CRÍTICO/ABERTO:** autenticação anônima, mitigação de flood e SELECT cross-browser ainda não aprovados. | AG-08 preparar parecer, equipe deliberar, aplicar/testar RLS/GRANTs antes de publicar. |
| **R-03/BLK-04** | **Parcialmente mitigado:** Git agora identificado e `DATA_MODEL` materializado em `src/domain/types.ts`; drift ainda deve ser testado após AG-05/06. | AG-00/AG-07/10 verificar contrato e freeze; G2 continua parcial. |
















**Liberações de próxima rodada:** AG-06 apenas desenho até AG-05 versionado e validado; AG-08 análise de segurança sem endpoint público; AG-09 somente com UX entregue, usando mocks tipados até AG-07/08; AG-07 após fixtures AG-06; AG-11 provisório liberado. G2 não é aceito como conjunto ainda. Handoff AG-02 aceito como **evidência de entrega** com correções pendentes, não homologação de todo G2.
















































> **Versão:** 1.2.0 | **Data-base:** 2026-11-14 | **Dono:** AG-00 | **Aplicação:** obrigatória para AG-00 a AG-11, em ChatGPT ou Cursor.
> **Princípio:** só se marca `Concluído` com **evidência de entrega e validação real**; “planejado”, “proposto” e “executado” são categorias diferentes.
































## CHECKPOINT DE HANDOFFS E RISCOS — 14/11/2026 — v1.1.0
































**AG-01:** [DATA_MODEL.md v1.0.0](https://drive.google.com/file/d/1vNF2QbKs30x9aNeGqGpCz-txru4OxnaQ/view) contém modelo, tipos, JSON A/B/C, DDL proposto, merge e handoff §13. A equipe informou **aprovação do contrato G1** após o handoff original (escrito antes da aprovação). Não houve execução de SQL, testes de produto ou integração remota.
































**AG-03:** [BRAND_SYSTEM.md](https://drive.google.com/file/d/1TYfIBbUIDPgJfAGFDYDKuGduzYxSJJaJ/view), [HANDOFF_AG03.md](https://drive.google.com/file/d/10Ar1BVEdCDb4tBQIuTG3iWQMTnDH6ZEJ/view), tokens, SVGs e auditoria de contraste encontrados. A equipe escolheu a primeira direção recomendada **Ponte Viva**. O relatório aponta 18 pares de cores válidos; testes responsivos/teclado da SPA não executados.
































| Bloqueador/risco | Situação atual | Tratamento |
|---|---|---|
| BLK-01 / G1 e R-03 | **RESOLVIDO quanto à ausência/aprovação do contrato** | Congelar AG-01 v1.0.0, impedir drift de tipos entre AG-02/05/06/07/08/09. R-03 conserva risco residual até compilação/testes integrados. |
| BLK-06 / identidade | **RESOLVIDO parcialmente** | Ponte Viva aprovada para UI/pitch. Cardinalidade catálogo (PEND-09), slogan institucional, licença/fidelidade SVG e testes responsivos ainda abertos. |
| BLK-02 / G1S, R-01 | **ABERTO crítico** | Autenticação anônima não substitui antiabuso. Equipe/AG-08 definem controles antes de INSERT público; sem G1S, fallback honesto. |
| BLK-03 / G1S, R-02 | **ABERTO crítico** | RLS do dono não permite SELECT em outra sessão; projeção/RPC sintética minimizada é proposta AG-01, requer aprovação explícita e testes de enumeração. |
| BLK-04 e BLK-05 | **ABERTOS** | Repositório/git e ambientes Supabase/Cloudflare ainda não verificados. AG-02/08/10 reportam evidência, sem segredos. |
































**Liberações:** AG-02/04/05 podem iniciar; AG-06 planeja e só fecha fixtures após AG-05; AG-08 inicia análise G1S sem deploy remoto; AG-11 desenvolve pitch provisório. AG-07, AG-09 (antes scaffold/UX) e AG-10 continuam bloqueados por gates posteriores.
































**Regras de handoff:** ambos os agentes são concluídos **documentalmente** após aprovação humana, não como implementação. Novos handoffs exigem versão de PROMPTS.md usada, artefatos com links, ambiente efetivo, testes executados, ausência de segredos e riscos residuais. As tabelas 'iniciais' mais abaixo são um snapshot v1.0.0; o checkpoint presente prevalece para status atual.
































## 1. Contrato universal de HANDOFF (copiar e preencher ao final de cada agente)
































```markdown
# HANDOFF DEMANDA VIVA — AG-XX — [nome] — v[versão]
































- **Data/hora e ambiente:** [data, fuso, ChatGPT/Cursor, workspace/repo quando acessível]
- **Status REAL:** [Proposto | Liberado | Em andamento | Bloqueado | Concluído]
- **Objetivo autorizado / tarefas:** [IDs de TASKS/US, escopo realizado e o NÃO realizado]
- **Fontes efetivamente lidas:** [links/caminhos + versão/revisão]; **fontes não acessíveis:** [nome e impacto]
- **Entradas e contratos:** [versões aprovadas de PROJECT_CONTEXT/DATA_MODEL/ADR etc.]
- **Arquivos criados/modificados:** [caminho/link verificável, descrição, dono primário]; **arquivos não alterados:** [limite de atuação]
- **Implementação/entrega real:** [o que existe e pode ser inspecionado; dados fictícios vs operações remotas]
- **Decisões assumidas dentro do escopo:** [ID, fonte, justificativa]; **propostas para aprovação:** [sem decidir unilateralmente]
- **Testes/validações realmente executados:** [comando/ambiente/caso/resultado/log/link]; **não executados:** [motivo]
- **Evidências:** [commit/PR, URL real, captura, relatório, arquivo; sem segredos]
- **Riscos encontrados:** [ID do registro, causa, impacto, probabilidade, resposta]
- **Bloqueios e decisões pendentes:** [dono, ação, gate afetado]
- **Dependências liberadas:** [agente, artefato e versão, condições]; **dependências ainda bloqueadas:** [...]
- **Instruções para o próximo agente:** [inputs, interfaces, restrições, casos a testar]
- **Declaração de limites:** [sem afirmar deploy, acesso remoto, SQL aplicado, aprovação AC real ou teste inexistente]
```
































**Checklist de aceitação do handoff pelo AG-00:** (1) identifica precisamente o artefato e seus donos; (2) separa mudança pretendida de executada; (3) explicita quais documentos e qual versão foram lidos; (4) apresenta teste verificável para afirmações de conformidade; (5) registra novos riscos/decisões; (6) cita o próximo agente **somente se dependências estiverem satisfeitas**. Sem esses itens, devolver como `Proposto` ou `Bloqueado`, não `Concluído`.
































## 2. Modelo de atualização rápida do quadro de execução
































```markdown
## CHECKPOINT PMO — [data/hora] — v[revisão]
| Agente | Status real | Entrega comprovada / link | Gate | Bloqueio atual | Próxima ação | Responsável |
| --- | --- | --- | --- | --- | --- | --- |
| AG-XX | Liberado | Nenhuma (ainda) | G1 | Aguardando contrato | Criar DATA_MODEL | AG-01 |
































**Entregas verificadas nesta rodada:** [IDs, paths e evidências]
**Riscos que mudaram:** [ID, mudança, motivo]
**Decisões aprovadas/pendentes:** [IDs + link de aprovação]
**Gates abertos/fechados:** [critério exato, evidência, autor da liberação]
**Bloqueios e responsáveis:** [ID, ação, dono]
**Agentes liberados agora:** [somente os habilitados]
```
































### Regras operacionais do estado
































| Estado | Significado rigoroso | Evidência mínima |
| --- | --- | --- |
| **Proposto** | Atividade solicitada mas não liberada ou entrega ainda conceitual | Tarefa e escopo definidos |
| **Liberado** | Pré-requisitos verificados; pode começar | Link de contrato/gate aprovado, quando aplicável |
| **Em andamento** | Evidência de início real | Arquivo de trabalho, commit, execução documentada ou handoff parcial |
| **Bloqueado** | Não pode avançar no escopo indicado | Dependência/decisão concreta e responsável pelo desbloqueio |
| **Concluído** | Entregável disponível, validado e aceito | Caminho/link + critérios demonstrados + testes/validações e handoff |
































Não atribuir datas retroativas nem inventar estimativas. “Arquivos produzidos pelo agente” não significa “funcionalidade já integrada, testada ou publicada”. Se um agente não conseguiu acessar Drive, repositório, Supabase ou Cloudflare, deve informar **ausência de acesso** em vez de simular conclusão.
































## 3. Matriz de riscos inicial
































**Escalas:** probabilidade `B/M/A` (baixa/média/alta), impacto `B/M/A/C` (baixo/médio/alto/crítico); classificação é **preliminar do PMO**, sujeita a reavaliação. Estado `Aberto` não significa que o incidente já aconteceu.
































| ID | Risco — causa | P/I | Dono | Mitigação preventiva e evidência exigida | Gatilho / contingência | Estado |
| --- | --- | --- | --- | --- | --- | --- |
| **R-01** | **INSERT Supabase público sem controle suficiente**, flood e abuso | A/C | AG-08 + equipe | Decisão G1S; Auth Anonymous + RLS + mitigação efetiva antiabuso ou rota segura equivalente; testes negativos e limites; nenhuma policy aberta apenas para demo | Se não houver escrita segura, **não liberar endpoint**; executar demonstração local com aviso | Aberto / crítico |
| **R-02** | **Leitura ampla de demandas / falsa segurança do seletor de AC** | A/C | AG-08 + AG-09 | Projeção minimizada apenas de dados sintéticos; revisão GRANT/RLS; “modo demo” sem alegação de controle por AC | Se houver PII ou exposição inadvertida, bloquear publicação; eliminar dado e revisar acesso | Aberto / crítico |
| **R-03** | **Contrato AG-01 ausente ou divergente**, agentes geram tipos incompatíveis | A/A | AG-01 + AG-00 | Freeze de contrato versionado com aprovação G1; matriz de campos/estados e exemplos A/B/C antes dos consumidores | Conflito no compile/SQL → suspender integração, corrigir via proposta contratual aprovada | Aberto |
| **R-04** | **False match**: score compensando gate, custo inventado ou solução expirada | M/C | AG-07 + AG-10 | Ordem determinística de gates, testes A/B/C, razões explícitas e evidência; proibir score de inelegíveis | Falha teste B → vetar release até correção do motor | Aberto |
| **R-05** | **Inconsistência entre fixtures, seeds e resultados remotos**, contagem fixa ou duplicação | A/A | AG-06/08/09 | IDs estáveis, merge/dedupe e testes com 0,1,N registros remotos; cluster recalculado | Contagem enganosa → mostrar número real, destacar ID recém-criado; não encenar “4→5” | Aberto |
| **R-06** | **Supabase Free pausado/offline ou falha de rede** durante banca | M/A | AG-08/09/10 | Smoke pré-demo, tratamento de erro, fallback seed, retorno de API real antes de mensagem de sucesso | Em falha → fluxo local honesto, registrar demanda pendente e plano B sem cross-browser | Aberto |
| **R-07** | **Sem conta/permissão Cloudflare, SPA 404 em deep links ou URL não testada** | M/A | AG-02/10 + equipe | Confirmar acesso, build dist, teste HTTPS/refresh em janela anônima e celular, pacote estático de contingência | Sem URL verificada → não declarar deploy; demo local e limitação explícita | Aberto |
| **R-08** | **Confusão de aprovação simulada com ação real** de AC/startup/FACESP | A/A | AG-04/09/11 | Rótulos permanentes; microcopy sobre papéis fictícios; pitch fiel ao comportamento | Se roteiro afirmar validação real, corrigir tela e fala antes da banca | Aberto |
| **R-09** | **Dados reais inseridos em formulários públicos** apesar de proposta sintética | M/C | AG-01/08/09 + equipe | Campos controlados, texto curto, constraints, avisos e testes de sanitização; evitar PII e segredos | Detectado dado real → suspender leitura pública, remover registro conforme procedimento e revisar política | Aberto |
| **R-10** | **Briefing ruim ou falso cluster** por similaridade só lexical | M/A | AG-06/07/10 | Critérios problema+processo+restrições+objetivo, contraprova D e revisão AC simulada | Falso positivo → expor diferenças e separar grupos antes da chamada | Aberto |
| **R-11** | **Estouro de escopo / agentes editando arquivos alheios**, regressões | A/A | AG-00/02/09 | Ownership, limites, mocks, handoffs, freezes de G1/G2/G3, inspeção `git status` | Conflito de alterações → parar merge, revisar contrato e dono, reparar somente arquivos afetados | Aberto |
| **R-12** | **Fontes internas propostas tratadas como exigências oficiais FACESP**, imagem indevida de parceria | M/A | AG-00/03/11 | Citações corretas e disclaimer de propostas, sem logo sem licença ou métricas inventadas | Pitch ou tela afirmam oficialidade → bloqueio editorial e correção | Aberto |
| **R-13** | **Divergência documental ADR-001/002 ou slides C4 antigos** leva ao modelo errado | A/A | AG-00/01/02 | Precedência registrada; atualização de arquitetura lógica; revisão de contratos e microcopy | Implementação sem Supabase ou simulando backend inexistente → reorientar antes de G3 | Aberto |
| **R-14** | **Limites de tempo e ausência de evidência de QA**, apresentação inverificável | A/A | AG-00/10/11 | P0 antes de P1; matriz de aceites, foco A/B/C + dados remotos seguros, pitch provisório condicionado | Tempo esgotado → reduzir P1/navegação lateral, nunca desabilitar RLS ou inventar status | Aberto |
































## 4. Bloqueadores ativos e decisões exigidas
































| Bloqueador | Dependência não atendida | Responsável e passo de resolução | Frentes afetadas |
| --- | --- | --- | --- |
| **BLK-01 / G1** | `DATA_MODEL.md` com tipos e DDL ainda não submetido/aprovado | AG-01 produzir; equipe aprovar; AG-00 registrar revisão | AG-02/04 final/05/06/07/08/09 |
| **BLK-02 / G1S** | Política INSERT e proteção antiabuso ainda aberta | Equipe + AG-08 deliberar, AG-08 implementar/testar | AG-08/09/10 e demo cross-browser |
| **BLK-03 / G1S** | SELECT de dados sintéticos/projeção pública sem decisão | Equipe + AG-08 definir e testar RLS/GRANTs | AG-08/09/10 |
| **BLK-04** | Repositório Cursor + espelhamento canônico não comprovados | Equipe informar repo; AG-02 inspecionar e sincronizar `docs/` com evidência | Todos os Cursor |
| **BLK-05** | Ambientes Supabase e Cloudflare não comprovados | Equipe disponibilizar acesso seguro; AG-08/10 verificar sem divulgar segredos | G3/G5/G6 |
| **BLK-06** | Catálogo 2–3 vs 4–6 e identidade visual final pendentes | Equipe deliberar com AG-05/03 | AG-05/09/11 |
































## 5. Política de escalonamento e reação
































1. **Risco crítico de segurança (R-01, R-02, R-09):** AG-08/10 sinaliza bloqueio ao PMO e à equipe. **Não contornar RLS/GRANTs, CAPTCHA ou minimização para alcançar a banca.** Preferir demo local com limitação transparente.
2. **Conflito de contrato/escopo:** agente documenta a incompatibilidade sem sobrescrever fonte aprovada; AG-00 registra `PEND-...` em `DECISIONS.md`; equipe decide; agentes afetados recebem nova revisão.
3. **Teste falhando:** mover história para `Bloqueado`; anexar entrada, saída real, comando, ambiente, responsável e decisão de correção. Nenhum score ou resultado é homologado apenas por screenshot.
4. **Dependência externa falha:** usar fallback previsto sem afirmar persistência, colaboração multiusuário ou aprovação remota. Revalidar antes de demonstrar conexão novamente.
5. **Termo FACESP ou marca:** comunicação apenas “Desafio FACESP — Hackathon Connect 7.0”; jamais atribuir políticas internas ou validação institucional à FACESP sem evidência específica.
































## 6. Critérios de liberação por ambiente
































**ChatGPT (AG-00/01/03/04/05/06/11):** pode ler fontes acessíveis, produzir documentos completos e enviar para pasta autorizada. Se não puder escrever o repositório Cursor, fornece conteúdo integral, paths e instruções de transferência; link de Drive não prova que código foi versionado.
































**Cursor (AG-02/07/08/09/10):** lê `docs/PROJECT_CONTEXT.md`, `AGENTS.md`, `DATA_MODEL.md` aprovado e `DECISIONS.md` antes de tocar no código; inspeciona status Git; trabalha na pasta definida em `AGENTS.md`; executa testes relevantes; reporta comandos e resultados; não comita automaticamente sem instrução; nunca escreve segredo em commit ou prompt. Se fonte não estiver local, marca bloqueio e pede espelhamento.
































**PMO:** recebe handoff, confere o artefato e evidência, atualiza riscos e status, registra decisão pendente, libera o próximo agente **somente após gates verificáveis**. A aprovação da equipe deve indicar nome/ato, revisão/data e escopo. A simples emissão deste protocolo não significa que os agentes o executaram.
































## 7. Registro inicial de checkpoint — 2026-11-14
































- **AG-00:** seis documentos de governança planejados nesta execução; publicação verificável no Drive e revisão da equipe são controles de aceite separados.
- **AG-01:** liberado para elaborar contrato; sem `DATA_MODEL.md` ou aceite evidenciado.
- **AG-03:** liberado para elaborar marca/tokens; sem entrega evidenciada.
- **AG-04 / AG-11:** podem atuar apenas em conceitos e roteiros provisórios.
- **AG-02 / 05 / 06 / 07 / 08 / 09 / 10:** dependem de gates listados; nenhuma implementação ou deploy comprovado.
- **Riscos prioritários:** R-01/R-02/R-03/R-04/R-06/R-14. **Próxima revisão:** após HANDOFF do AG-01 e parecer de segurança para G1S.