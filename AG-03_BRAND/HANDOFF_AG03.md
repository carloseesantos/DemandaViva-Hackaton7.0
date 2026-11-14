# HANDOFF DEMANDA VIVA — AG-03 / v1.0

**Status real:** proposta de sistema de marca e assets concluídos, com aprovação humana da direção pendente. Nenhuma alteração no repositório de aplicação ou deploy foi executada.

**Escopo executado:** leitura dos Docs 00–03, ADR-002 e Slides C4 (04); três direções distintas; recomendação Ponte Viva; wordmark DEMANDA dominante/VIVA complementar; tokens CSS/JSON; guia de componentes; exemplos pontuais de header e resultados A/B/C; logo horizontal/compacto, favicon, quadro comparativo; contraste de 18 pares funcionais calculado.

**Fontes efetivamente lidas:**
- 00 — Decisão de marca e identidade verbal (v1.0)
- 01 — Rede decisória e governança (v1.0)
- 02 — Diagnóstico, catálogo validado e régua de compatibilidade (v1.0)
- 03 — Briefing técnico, demandas similares e chamada às startups (v1.0)
- 04 — Mapas visuais C4 e fluxos decisórios (v1.0)
- 06 — ADR-002 Persistência híbrida de demandas (proposta v1.0)
- 07 — Plano de agentes e prompts operacionais (v1.0), para interoperabilidade dos handoffs

**Arquivos criados:** `BRAND_SYSTEM.md`, `tokens.css`, `tokens.json`, `UI_COMPONENT_GUIDE.md`, `APPLICATION_EXAMPLES.md`, `logo-horizontal.svg`, `logo-compact.svg`, `favicon.svg`, `directions-board.svg`, `CONTRAST_AUDIT.md`, `README.md`, este handoff. PNGs gerados apenas como prévias; scripts de auditoria e geração de tokens incluídos para reprodutibilidade.

**Decisões tomadas:** nome preservado; direção 01 recomendada e não aprovada unilateralmente; slogan preservado como referência não institucional; estados A/B/C visualmente diferentes mas igualmente claros; B não é fracasso; sinal de demo obrigatório.

**Restrições respeitadas:** sem logo FACESP; sem alegar validação real de startups, critérios oficiais FACESP ou registro de marca; nenhum software criado automaticamente; dados fictícios; filtros eliminatórios antes de score; nada de telão UX completo em substituição ao AG-04; perfis são simulação; Supabase somente para novas demandas qualificadas, com sucesso remoto sinalizado apenas após confirmação.

**Testes executados:** `audit_contrast.py` valida 18 combinações de cores funcionais, sem falhas; SVGs renderizados em PNG para inspeção visual. **Não** foram executados testes de UI responsiva/teclado/leitor de tela em navegador, porque a SPA integrada não está no escopo deste agente.

**Lacunas / riscos:** aprovação visual pendente; logo em `<text>` depende da fonte Manrope (para produção, incorporar fonte de forma licenciada ou exportar para paths); ausência de deploy real para testar branding no aplicativo; fidelidade das telas depende AG-04/09. O nome não teve busca legal de anterioridade.

**Pendências de aprovação humana:** direção 01, símbolo, paleta e eventual institucionalização do slogan. Nenhuma dessas pendências altera o naming já aprovado.

## Handoff para AG-09 — Frontend e integração

1. Consumir `tokens.css` como fonte semântica da direção recomendada; usar `logo-horizontal.svg`, `logo-compact.svg`, `favicon.svg` sob `public/brand/` depois da aprovação.
2. Implementar padrões do `UI_COMPONENT_GUIDE.md`; os trechos `APPLICATION_EXAMPLES.md` são referências, não páginas finais. Ajustar sequência e conteúdo conforme AG-04.
3. Persistir disclosure **DEMONSTRAÇÃO • DADOS FICTÍCIOS** ao longo da jornada, com status reais de carregamento, falha, offline, retry e origem do registro.
4. Exibir score apenas se motor AG-07 confirmar elegibilidade; mostrar motivo e requisito bloqueante nos candidatos reprovados; pesos/faixas do Doc 02 sempre identificados como proposta não oficial.
5. `saved` só após sucesso confirmado do Supabase (AG-08); botões de aprovação e chamada devem levar `(simulação)` quando não houver operação real.
6. QA de foco, contraste em contexto, 320px, 200% zoom, reduced motion, teclado, leitor de tela; não declarar conformidade antes de testes.

**Dependências liberadas:** tokens, SVGs e guia visual prontos para integração *provisória*. Contratos AG-01/AG-04/07/08 determinam comportamento, dados e páginas.

## Handoff para AG-11 — Pitch e banca

1. Utilizar identidade “Ponte Viva” como **proposta pendente de aprovação**; capa com DEMANDA predominante; slogan de referência, sem apresentá-lo como oficial FACESP.
2. Narrativa visual: problema > diagnóstico > filtros > **A: solução elegível** OU **B: briefing + cluster + oportunidade**. Ressaltar que o produto não cria software automaticamente.
3. Sinalizar cenários 90/100, lojas e ACs e métricas como dados de demonstração sintéticos, não tração ou validação de mercado.
4. Em qualquer slide com critérios, apresentar “Método e pesos propostos pela equipe — não critérios oficiais FACESP”.
5. Solicitar telas efetivas do AG-09 e URL/QA comprovados por AG-10 antes de congelar o pitch; sem uso de identidade oficial FACESP não autorizada.

**Próximo checkpoint:** equipe aprova direção visual; AG-09 e AG-11 incorporam o pacote e relatam eventuais ajustes necessários.
