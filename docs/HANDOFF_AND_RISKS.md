# DEMANDA VIVA — HANDOFF UNIVERSAL E REGISTRO DE RISCOS

> **Versão:** 1.0.0 | **Data-base:** 2026-11-14 | **Dono:** AG-00 | **Aplicação:** obrigatória para AG-00 a AG-11, em ChatGPT ou Cursor.
> **Princípio:** só se marca `Concluído` com **evidência de entrega e validação real**; “planejado”, “proposto” e “executado” são categorias diferentes.

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
