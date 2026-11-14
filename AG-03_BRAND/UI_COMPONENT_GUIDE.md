# DEMANDA VIVA — Guia de componentes UI

**Direção 01 / Ponte Viva — AG-03 v1.0, proposta para aprovação.** Os fluxos e as telas definitivas pertencem ao AG-04/AG-09. Esta especificação é a camada visual e semântica, não uma aplicação pronta.

## 1. Princípios de componentes

1. **Explicabilidade primeiro:** filtros obrigatórios e motivos de inelegibilidade são anteriores ao score; não esconder a causa em ícones ou tooltips.
2. **Estado verdadeiro:** “registrado na nuvem” depende de sucesso confirmado; “revisado pela AC” e “encaminhado” só são reais se efetivamente executados, caso contrário rotular `simulação`.
3. **Duas saídas igualmente legítimas:** matching elegível e briefing técnico têm CTAs com proeminência apropriada; não usar um visual de “falha” para o caminho B.
4. **Dados sintéticos expostos:** faixa “DEMONSTRAÇÃO • DADOS FICTÍCIOS” em todas as visões; soluções, evidências, pontuação e estatísticas do exemplo também são sintéticas.
5. **Sem perfis seguros fictícios:** seletor de persona é `Visão de demonstração`, nunca botão “Entrar como Associação” sem autenticação.

## 2. Botões

| Tipo | Implementação | Uso | Regra |
|---|---|---|---|
| Primário | fundo `--dv-color-primary`, texto `--dv-color-on-primary`, 44px min alto, padding 12/20, raio 8px | “Iniciar diagnóstico”, “Revisar briefing” | Um primário predominante por seção; 7.44:1 branco/petróleo |
| Secundário | fundo `--dv-color-accent-soft`, texto `--dv-color-primary`, borda 1px petróleo opcional | “Ver critérios”, “Voltar” | Contraste de texto >= 4.5 |
| Terciário/link | texto petróleo e underline, sem depender de cor | “Como calculamos?” | Evitar ação escondida |
| Crítico | fundo claro de estado de erro, texto `#991B1B`, confirmação contextual | ações irreversíveis apenas se implementadas | Não simular exclusões remotas |
| Loading | mesmo tamanho e texto “Salvando…”; disabled condicionado | envio ao Supabase | `aria-busy`, impedir duplo submit; status textual |
| Inativo | visual neutro + descrição do pré-requisito ausente | requer dados obrigatórios | Disabled não substitui mensagem de validação |

**Estados:** default / hover / focus-visible / active / busy / disabled. Tamanho mínimo de alvo `44×44px`; distância adequada entre alvos móveis; foco `3px` com `2px` offset. Não usar animação para comunicar confirmação. Textos de botão em modo demo: “Solicitar demonstração (simulação)”, “Preparar chamada (simulação)”.

## 3. Cartões

- **Card padrão:** fundo branco, borda decorativa `#C6D5DD`, raio 12px, padding 20–24px desktop e 16px mobile, sombra sutil. Título H3; status com ícone + texto, conteúdo objetivo, CTA em rodapé.
- **Card de demanda:** ID, AC fictícia, problema observável, etapa operacional, requisito bloqueante, origem `Exemplo local` ou `Demonstração salva` (somente após sucesso), tempo/data quando fornecidos. Nada de dados reais.
- **Card de solução elegível:** nome fictício, “Solução do catálogo de demonstração”, filtros aprovados, score **realmente calculado pelo motor**, critérios 30/20/20/15/15, evidência simulada e data, custo conhecido/desconhecido, CTA condicionado à decisão simulada da AC. Não transformar score em probabilidade de sucesso.
- **Card inelegível:** não apresentar score; mostrar “Inelegível” + requisito obrigatório reprovado + próxima ação possível (corrigir diagnóstico ou briefing); visual de bloqueio não deve impedir o usuário de entender a alternativa.
- **Card de briefing:** problema, contexto, requisitos, restrições, meta e perguntas em aberto; “Minuta de briefing — revisão da AC (simulada)” e CTA de revisão; nunca “Software criado”.
- **Card de cluster:** quantidade **calculada** de demandas distintas, quantidade de ACs, diferenças relevantes, status `Agrupamento sugerido — aguarda revisão`; não dizer “validação estatística” ou “recorrência real de mercado”.

## 4. Status e badges

| Código UI | Texto mostrado | Comportamento |
|---|---|---|
| `recommended` | “Solução recomendada” | somente após gates + nota >= 80 no motor proposto; ainda requer revisão da AC |
| `conditional` | “Compatibilidade condicional” | score 65–79 após gates; indicar pendências; não equivale a recomendação definitiva |
| `ineligible` | “Inelegível: requisito obrigatório não atendido” | exibir motivo de gate; **score não renderizado** |
| `insufficient` | “Dados insuficientes” | lista de perguntas; **sem score e sem briefing definitivo** |
| `briefing` | “Briefing técnico preparado” | quando não há match elegível, demanda qualificada; minuta aguarda revisão |
| `demo` | “DEMONSTRAÇÃO • DADOS FICTÍCIOS” | persistente em cada visão e no pitch |
| `saving` | “Salvando demanda…” | `role=status`; sem confundir processo local e remoto |
| `saved` | “Demanda registrada na nuvem” | apenas após `save` resolvido com ID remoto confirmado |
| `offline` | “Não sincronizada — tente novamente” | se erro remoto; diferenciar rascunho local / compartilhamento não concluído |
| `simulated` | “Ação simulada — nenhuma comunicação foi enviada” | botão para chamada, aprovação, resposta de startup no P0 |

Os tokens de estado estão em `tokens.css`. Use `role=status`/`aria-live=polite` para progresso; `role=alert` para falhas que exigem intervenção. Combinar sempre ícone, palavra e explicação — não apenas cor.

## 5. Formulários e diagnóstico guiado

**Campo de texto:** label persistente acima, pista opcional abaixo, altura mínima 44px, fonte 16px, borda funcional `#748D9B`, foco com contorno `#075E6B` 3px. O placeholder é exemplo, nunca a única label. Descrições e erros conectados por `aria-describedby`.

**Perguntas do Doc 02 (linguagem acessível):**
- “O que aconteceu da última vez?”
- “Em qual etapa da rotina isso acontece?”
- “Com que frequência?”
- “Como vocês resolvem hoje?”
- “Quais ferramentas já utilizam? Há ERP ou planilha?”
- “Qual custo mensal máximo cabe no seu negócio?”
- “O que a solução precisa obrigatoriamente fazer?”
- “Que resultado mensurável você espera alcançar?”

Controles: seleção de AC fictícia; radio/cards para canal (físico/digital/híbrido) com opções semanticamente nomeadas; opções de requisito `Obrigatório`/`Desejável`/`Não se aplica`; moeda e periodicidade explícitas; resumo para confirmação antes de persistir.

**Validação:** mensagem específica por campo; não presumir orçamento zero quando `unknown`, nem ERP disponível sem confirmação. Etapa “Revisar e confirmar” verifica se a demanda é qualificada; se faltarem dados essenciais, resultado C com CTA para completar.

**Progresso:** `Etapa N de M`, `progress` semântico ou `aria-valuenow`, etapa anterior disponível; preservação de resposta ao voltar. Para demo, evitar falsamente afirmar que um interlocutor humano/LLM está ao vivo se a entrevista é por regras fixas.

## 6. Layout responsivo e alcance

- **Mobile (320–767px):** barras empilhadas; wordmark horizontal reduzido ou marca compacta + nome; formulário de coluna única; botões largura total quando necessário; CTA visível sem esconder o aviso demo; cards empilhados; score após explicação dos gates.
- **Tablet (768–1023px):** duas colunas somente em cards comparáveis, formulário com largura útil ≤720px.
- **Desktop (>=1024px):** header com navegação, conteúdo central max 1120px, formulários max 720px, painel AC em grid de cards; nunca obrigar leitura em três colunas estreitas.
- **Pitch 16:9:** títulos grandes, no máximo um diagrama principal/slide, palavra DEMANDA dominante, legenda `Exemplo fictício` visível, números sem atribuição a métricas reais.

## 7. Acessibilidade e práticas de engenharia

- WCAG 2.2 AA como objetivo, sem declarar conformidade antes de teste de produto.
- Texto normal ≥4.5:1 (tokens listados verificados em `CONTRAST_AUDIT.md`); objetos visuais e foco identificáveis ≥3:1 quando necessários.
- `prefers-reduced-motion` suportado; animações só discretas; sem mensagens apenas transitórias.
- HTML semântico, ordenação de foco, tecla Esc para fechar diálogos, restauração do foco, modal com título, rolagem não travada em telas curtas.
- Não usar verde-água `#25BAA7` como texto pequeno sobre branco nem branco pequeno sobre este verde (contraste insuficiente).
- AG-09/10 devem testar com navegador real: zoom 200%, 320px, teclado, leitura por leitor de tela e modos de alto contraste.

## 8. Contratos com UX e domínio

- **AG-04** define qual tela, qual pergunta, os ramos e aceites; este documento define estilo, hierarquia, microcopy prototípica e semântica.
- **AG-07** define gates, score e briefing; a UI não injeta percentuais fixos, não chama recomendação o que foi reprovado e não determina cluster com match textual.
- **AG-08** define estado real de `save/list`; a UI apenas reflete status retornado, incluindo falha/offline.
- **AG-09** integra, sem criar fluxo de produção de autenticação inexistente.
- **AG-11** reutiliza o padrão visual e rotula dados simulados, sem usar selo/identidade oficial FACESP.
