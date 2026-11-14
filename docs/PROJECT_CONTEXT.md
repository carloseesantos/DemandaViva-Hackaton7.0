# DEMANDA VIVA — PROJECT_CONTEXT


## CHECKPOINT DE PRODUTO 1.3.0 — snapshot validado em 14/11/2026


[Main Git commit 31481ad](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/31481ad9b1e25b44e0b03b225a4794c3ea1d416a) e [ZIP principal do Drive](https://drive.google.com/file/d/1OslrqHYazOEYfNrpl_o42f6HUvud5UMI/view) conferidos nos arquivos críticos por hash Git. **AG-02**: scaffold e configurações versionados. **AG-04**: UX_FLOW.md e handoff versionados com oito templates, 22 perguntas e fluxos A/B/C. **AG-05**: catálogo sintético local com 4 startups/5 soluções, 5 casos de referência; pacote no Git. Capturas do executor mostram `npm run check` com 36 testes aprovados, lint/build/verify OK. Não são testes realizados independentemente pelo PMO.


**Próximos agentes:** AG-06 liberado para criar quatro seeds B sem ERP, duas ACs, caso A ERP X separado e contraprovas; AG-09 liberado para frontend com mocks tipados; AG-08 liberado para concepção de G1S e integração local segura, sem abrir banco ao público; AG-07 só após handoff AG-06. **G2 parcial até AG-06; G1S segue crítico, G3–G6 ainda não concluídos.** O ZIP não contém `src/data/seed-demands.ts` nem `registries.ts`. Não há projeto Supabase testado, URL Cloudflare verificada, fluxo fim a fim integrado nem regras FACESP oficiais aprovadas. Estados anteriores em 1.2.0 são históricos.






## CHECKPOINT OPERACIONAL 1.2.0 — AG-02 versionado; AG-04/05 aguardam integração (14/11/2026)




**Fonte auditada:** branch `main` no commit [ee7b426](https://github.com/carloseesantos/DemandaViva-Hackaton7.0/commit/ee7b426e816c8827755328587721ec21b7272f04) e ZIP/handoff do AG-02 [nesta pasta](https://drive.google.com/drive/folders/11CWoPsdT2MmPBx_zA2qN4SRabXdcpYB0). Agora existe scaffold React 19/TS/Vite 8, rotas placeholders, `docs/ARCHITECTURE.md`, tokens Ponte Viva, tipos AG-01, DI e repositório que falha fechado sem Supabase. Handoff do AG-02 reporta lint + 31 testes + build e seis deep-links 200 no Wrangler local, sem deploy público. Arquivos de setup `.env.example`, `.gitignore`, `.node-version` citados no handoff **não constam do snapshot versionado**: corrigir antes do G2 completo. Os testes relatados não foram reproduzidos pelo PMO: Node de auditoria 22.16.0 está abaixo do mínimo 22.22.0 e faltam pacotes no cache npm offline.




**AG-04 e AG-05:** execução declarada pelo usuário em chats, mas **UX_FLOW.md e catálogo TS não se encontram na árvore Git auditada**. O contrato G1 continua aprovado; a Ponte Viva continua aprovada; **G2 é PARCIAL** até receber/publicar e validar AG-04/05/06. O catálogo, motor, Supabase, telas definitivas e deploy não devem ser descritos como existentes. Status de agentes/gates no `TASKS.md` v1.2.0 prevalece sobre a baseline anterior.












> **Versão documental:** 1.2.0 | **Data-base:** 2026-11-14 | **Responsável:** AG-00 (PMO) | **Natureza:** baseline de planejamento, não comprovação de software executado.
> **Projeto:** Hackathon Connect 7.0 — Desafio FACESP. As propostas de regras e dados fictícios não são critérios oficiais da FACESP.








## CHECKPOINT DE PRODUTO — AG-00 v1.1.0 — 14/11/2026








**G1 e marca aprovados pela equipe:** o [DATA_MODEL.md v1.0.0 do AG-01](https://drive.google.com/file/d/1vNF2QbKs30x9aNeGqGpCz-txru4OxnaQ/view) passa a ser o contrato canônico de domínio. A equipe selecionou a primeira direção recomendada pelo AG-03, **01 Ponte Viva**, documentada em [BRAND_SYSTEM.md](https://drive.google.com/file/d/1TYfIBbUIDPgJfAGFDYDKuGduzYxSJJaJ/view). A aprovação foi comunicada ao AG-00 na conversa de 14/11/2026; não há alegação de homologação institucional FACESP ou banco criado. As descrições de status 'inicial' nas seções 8 e seguintes referem-se à baseline anterior.








**Contrato G1 (v1) para próximos agentes:** QualifiedNeed final confirmada e tipada; NeedDraft/entrevista apenas local; somente novas fichas qualificadas sintéticas no Supabase, tabela proposta public.demo_demands (schema_version=1). Quatro seeds B de duas ACs fictícias, sem ERP e com IDs estáveis; cenário A com ERP X é fixture de teste SEPARADA; cenário C incompleto não é persistido. Enums/códigos, requisitos, `hasErp/erpCode`, métrica, serialização, status de gates/score, IDs, dedupe e cluster devem ser consumidos do DATA_MODEL, sem reinvenção. Supabase não salva histórico de balões, Brief, MatchResult, cluster, aprovação ou chamada no P0.








**Direção visual vigente:** Ponte Viva, marinho `#11273A`, petróleo `#075E6B`, acento verde-água `#25BAA7`, Manrope; assets SVG e `tokens.css` do AG-03. Naming DEMANDA VIVA aprovado anteriormente; slogan 'Necessidades que viram oportunidades.' ainda é recomendação editorial, não adoção institucional. O AG-03 reportou 18/18 pares HEX conformes aos limites calculados; a UI integrada continua sem QA.








**Situação operacional:** AG-01/03 concluídos documentalmente e aprovados nos respectivos gates. AG-02/04/05 liberados para começar; AG-06 pode preparar cenários mas finalizar somente após catálogo AG-05; AG-08 pode projetar segurança G1S sem abrir banco público; AG-11 pode redigir pitch provisório. AG-07/09/10 dependem de handoffs posteriores. G1S (Auth Anonymous, projeção cross-browser/SELECT e antiabuso), repositório, SQL aplicado, testes e deploy NÃO estão comprovados. Consultar TASKS.md/DECISIONS.md v1.1.0 para status atual.








## 1. Contexto e proposição de valor








**DEMANDA VIVA** é uma plataforma demonstrativa de inovação aberta que transforma dores do pequeno varejo em **recomendações tecnológicas justificáveis** ou **oportunidades qualificadas para startups**. O ativo principal é a demanda, que permanece útil mesmo quando nenhuma solução do catálogo consultado se mostra elegível. Assinatura recomendada: **“Necessidades que viram oportunidades.”** A marca foi aprovada internamente (DEC-BRAND-001); a assinatura continua recomendação de comunicação. A palavra **DEMANDA** prevalece visualmente sobre **VIVA**.








A plataforma **não desenvolve software automaticamente**, não certifica a existência ou inexistência de soluções no mercado e não substitui decisão humana. O lojista confirma o problema; a Associação Comercial (AC) revisa e medeia; a startup esclarece, adapta, propõe ou executa um piloto; a regional/FACESP observa agregados na visão conceitual. No MVP, aprovações, chamadas e respostas são **simuladas e indicadas como tal**.








## 2. Públicos e direitos de decisão








| Público | Papel no fluxo conceitual | Comportamento no MVP |
| --- | --- | --- |
| Lojista | Relatar fatos, confirmar requisitos, autorizar encaminhamento, avaliar resultado | Entrevista guiada com personagens e informações fictícias; confirmação da ficha |
| AC local | Curadoria, validação de diagnóstico e match, revisão de cluster, autorização de chamada | Painel demonstrativo, decisões **simuladas** sem autenticação de AC |
| Startup | Evidências, esclarecimentos, proposta, demonstração e eventual piloto | Resposta fictícia em interface de demonstração; sem compromissos reais |
| Regional/FACESP | Visão agregada e articulação da rede | Indicadores agregados simulados/derivados de dados sintéticos; sem dados identificáveis |








## 3. Três resultados obrigatórios








**A — Match elegível:** necessidade qualificada; todas as barreiras obrigatórias superadas; score calculado e explicado; recomendação sujeita à revisão da AC. **Cenário de referência:** papelaria fictícia com ERP X e solução fictícia EstoquePonte; notas 5, 5, 4, 4 e 4 nos cinco critérios, gerando **90/100** pela fórmula proposta. O valor deve ser calculado pelo motor, nunca codificado como resultado fixo.








**B — Sem match elegível no catálogo:** pelo menos uma condição obrigatória de cada candidata é reprovada (ou não há candidata recomendável); registrar motivos, produzir **minuta de briefing técnico**, comparar demandas por problema/processo/restrições e oferecer à AC **revisão humana simulada** de cluster e chamada. **Cenário de referência:** loja fictícia com WhatsApp e planilha, sem ERP X; EstoquePonte exige ERP X e, portanto, é **inelegível sem score**. Texto permitido: “Não identificamos uma solução elegível no catálogo consultado, considerando as restrições informadas.”








**C — Dados insuficientes:** faltam informações essenciais para qualificar ou avaliar; apontar campos em aberto e permitir complementação. Não classificar como B nem emitir recomendação/briefing definitivo.








## 4. Qualificação e compatibilidade








1. Guiar o relato: AC e origem fictícias, segmento, porte, canal, dor observável, episódio recente, frequência e impacto, processo atual, sistemas existentes, requisitos obrigatórios/desejáveis, teto rígido, restrições, indicador, linha de base, meta e confirmação.
2. Separar **fatos confirmados**, hipóteses e dados pendentes. A ficha somente se torna `qualified` após validações previstas no fluxo de demonstração.
3. Aplicar **gates eliminatórios antes da pontuação**: função essencial; sistemas/integrações/hardware; orçamento rígido; dados/privacidade; território/porte/canal; curadoria/evidência e vigência. Registrar todas as reprovações e incertezas.
4. Pontuar apenas elegíveis: funcional **30%**, técnica **20%**, econômica **20%**, implantação/operação **15%**, maturidade/evidência **15%**; notas inteiras de 0 a 5. `score = soma(peso × nota/5)`. Faixas **propostas da equipe**, não oficiais: 80–100 recomendado sujeito à AC; 65–79 condicional; <65 não recomendar. Falta de dados críticos bloqueia conclusão.
5. Explicar forças, ressalvas, evidências simuladas, custos declarados ou desconhecidos, data da avaliação, condições e próximo passo. Compatibilidade e confiança/evidência são dimensões distintas.








## 5. Arquitetura vigente para este MVP








**Frontend:** Single-Page Application **React + TypeScript + Vite**; múltiplas rotas, build `npm run build`, saída `dist`, publicação alvo **Cloudflare Pages**. Sem API Node própria e sem integração real com ERPs ou LLM em tempo real. Motor determinístico e dados versionados.








**Dados locais e estáticos no frontend:** catálogo de startups/soluções **fictícias** (e evidências explicitamente simuladas); pesos, filtros, templates e regras; **quatro demandas seed fictícias de duas ACs**; exemplos de cluster, chamada e resposta. Rascunho de entrevista pode ficar em estado React ou em `localStorage` versionado, sempre identificado como local.








**Dados remotos:** somente **novas demandas qualificadas e confirmadas** são persistidas no **Supabase Postgres**, via `supabase-js` / Data API, em modelo mínimo `public.demo_demands` sujeito à aprovação do AG-01. O painel AC lê as demandas remotas de demonstração, combina-as às quatro seeds locais, deduplica por ID estável e recalcula agrupamentos no navegador. Não se importa a seed obrigatoriamente para o banco. O contador deve mostrar o estado real: “4→5” somente se não houver registros remotos adicionais relevantes.








**Repositórios recomendados:** `DemandRepository { save, list, get }`, com adaptadores de seeds estáticas, remoto Supabase e agregação/deduplicação. AG-01 fixa interfaces e mapeamento; AG-02 prepara a infraestrutura; AG-08 implementa acesso/segurança. A ADR-002 **prevalece sobre a ADR-001 apenas na persistência**; decisões de hospedagem e SPA permanecem.








**Segurança e honestidade operacional:** uso exclusivo de dados **sintéticos**; nenhum nome real, contato pessoal, CPF/CNPJ, segredo ou dado comercial confidencial. Só `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` podem ir ao frontend, jamais secret/service_role. Exigir RLS, GRANTs e validação efetiva; deliberar Auth Anonymous e proteção antiabuso antes de liberar INSERT público. O seletor “Lojista / AC / Startup / FACESP” é **troca de perspectiva, não autenticação nem autorização**. Se houver SELECT público, somente registros sintéticos e projeção minimizada apropriada à demo.








**Falhas:** se Supabase não responder, a SPA continua com catálogo e seeds; mostrar “Modo offline: novas demandas não serão compartilhadas entre navegadores”, distinguindo `rascunho local`, `aguardando sincronização`, `salvando`, `sincronizado` e `falha`. Apenas resposta remota bem-sucedida justifica “salvo na nuvem”. “Reiniciar demonstração” limpa estado local; nunca elimina demandas remotas silenciosamente.








## 6. Escopo MVP e critérios de demonstração








**P0 (necessário à banca):** perspectiva e aviso de simulação; entrevista e confirmação; resultados A/B/C; gates e score explicável; briefing técnico; 4 seeds/2 ACs; similaridade revisável e chamada/resposta simuladas; inserção remota de demanda qualificada; leitura em outro navegador com contador verdadeiro; integridade e segurança de acesso; fallback honesto; testes e URL Cloudflare Pages **verificada** por AG-10. A jornada principal deve caber em **2–3 minutos** de demonstração guiada.








**P1 (se houver capacidade):** replay da conversa, analytics avançado, armazenamento de aprovações/chamadas/respostas, autenticação real de perfis, integrações e CRM, piloto real, telemetria enriquecida. P1 **não autoriza** reduzir RLS nem deixar o P0 inseguro.








**Fora de escopo:** geração autônoma de software, banco de startups real, dados pessoais, pagamentos/contratos, implantação real, verificação oficial FACESP, aprovação humana efetiva por meio do seletor de tela.








## 7. Qualidade e definição de pronto








- Mesmos dados e regras → mesmos gates, score e cluster (AG-07/AG-10 apresentam testes reproduzíveis).
- A com ERP X → 90/100 calculado; B sem ERP X → inelegível **sem score**; C → complemento, sem diagnóstico fechado.
- A solução expirada/não validada não recebe “match confirmado”; custo desconhecido não é inventado.
- Quatro seeds em duas ACs; a quinta demanda, se inserida com sucesso, aparece em outra sessão após atualização; contagem nunca é presumida.
- Falha de rede não dispara falsa mensagem de sincronização; políticas negativas de RLS, ações permitidas, ausência de segredos e uso apenas de dados sintéticos são testados.
- Rotas profundas recarregam no Pages; mobile/desktop e navegação por teclado testados; URL, revisão e evidências documentadas.
- Nenhum “feito/testado/publicado” sem logs, arquivos ou URL comprovados em HANDOFF.








## 8. Estado inicial observado em 14/11/2026








Fontes de produto e plano de agentes existem no Drive e fundamentam esta baseline. **Não foi apresentada evidência de repositório de código, scaffold executado, instância Supabase, migração aplicada, RLS testada, aplicativo integrado ou Cloudflare Pages publicado.** Tais entregas permanecem **não comprovadas** até handoff do responsável. As pendências de política pública de leitura/escrita e antispam são bloqueadores de uma exposição remota segura. O contrato AG-01 exige aprovação antes das fixtures finais ou implementações de domínio.








## 9. Fontes canônicas e precedência








- [00 — Marca e identidade verbal](https://docs.google.com/document/d/1-upBHWiSTfwP_OyulOwvbBVDpSihy5q26Ifm7lQBIPI/edit)
- [01 — Rede decisória e governança](https://docs.google.com/document/d/1eNfgWeacmydoMVFgFdBkgJ0r9f02Fat_evxuhO-3vD0/edit)
- [02 — Diagnóstico, catálogo e régua](https://docs.google.com/document/d/1xyL8GIgOnLyxTCSpW5QA4BOYtX5znVo845DUSlYIT-M/edit)
- [03 — Briefing, similares e chamada](https://docs.google.com/document/d/119AhX_y2nUfuuZ9THB83PnCDWK2XCBVTgCG8KLKCLGI/edit)
- [04 — Slides C4/fluxos, representação conceitual](https://docs.google.com/presentation/d/1hZDbqhepboco73rFqeDbJfc2Q0qkhWM4SW-rMFwV2p4/edit)
- [05 — ADR-001](https://docs.google.com/document/d/1Zfa-k_rH_BYU6NCjXweql12Pkztk_lpYCRksqlBIF28/edit)
- [06 — ADR-002](https://docs.google.com/document/d/1vO34lMSNB95qUw5cjZLHje2WDyHb9XMkOaLNl1ZS0jM/edit)
- [07 — Plano de agentes e prompts operacionais](https://docs.google.com/document/d/1v9DjGvdYMEfphBo36xzvCPIGYN1AFp47QjCACCF1pbY/edit)








**Precedência operacional:** decisões novas efetivamente aprovadas pela equipe > instrução vigente sobre ADR-002 para persistência > contrato AG-01 **após aprovação** > demais fontes v1.0. Conflitos devem virar `DECISIONS.md`/risco, nunca ser resolvidos silenciosamente. C4/ADR-001 não devem ser tomados como fotografia da implementação híbrida atual.