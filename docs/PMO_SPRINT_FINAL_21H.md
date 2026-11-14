# DEMANDA VIVA — PLANO DE ENTREGA (PMO 1.5.0)

**Prazo informado:** 21h de 14/11/2026. **Snapshot auditado:** Git main `916b3d6` (AG-08 + AG-09) e ZIP atualizado no Drive; oito hashes Git de arquivos-chave coincidiram. AG-08/AG-09 reportaram `npm run check`: 76 testes, lint/build OK; ainda não é teste do motor AG-07 nem QA de Pages.

## DECISÃO DA EQUIPE: release local-only recomendado

Dada a janela, recomendamos publicar a SPA **sem Supabase configurado** (sem variáveis `VITE_SUPABASE_*` no Pages) e com `remoteSharingEnabled=false`. G1S não foi aprovado: não tentar liberar INSERT/SELECT público ou apresentar 4→5 entre sessões. Isso reduz escopo do P0 remoto; a equipe deve aprovar explicitamente esta opção e dizer isso no pitch. Não editar migrations ou desabilitar RLS.

## 1 — AG-07, primeira prioridade (Cursor)

Use o prompt integral AG-07 em `docs/PROMPTS.md`, acrescido desta instrução operacional:

> O Git `main` no commit 916b3d6 contém serviços provisórios AG-09 em `src/services/{matchingService,briefService,clusterService}.ts`. Substitua-os por motor canônico determinístico, preservando exatamente a API pública `evaluateNeed`, `evaluateSolution`, `buildBrief`, `suggestClusters` e os contratos AG-01. Leia `docs/DATA_MODEL.md`, `src/domain/types.ts`, `docs/ARCHITECTURE.md`, `docs/AG06_HANDOFF.md`, o catálogo AG-05, `docs/AG09_HANDOFF.md` e testes existentes. **Sem refatoração de UI, repositórios ou Supabase.** Faça os seis gates antes de pontuar; A=90 calculado, B sem ERP exige reprovação técnica sem score e briefing, C incompleto sem briefing definitivo, D igual texto mas contexto diferente não agrupa automaticamente, E só reprova custo na cópia R$299 do teste (catálogo real R$199). Tratar evidência expirada, preço/implantação desconhecidos e independência da ordem. Escreva testes próprios para o motor real, execute `npm run check` e registre `docs/AG07_HANDOFF.md` com diff, commit, falhas e limites. Não invente entregas remotas. Antes do commit, revisar `git status` para preservar mudanças alheias.

**Definição de pronto AG-07:** funções puras e exports compatíveis, 5 cenários A–E passando com testes canônicos, regression tests existentes e build. Entregar commit/handoff.

## 2 — AG-10 em paralelo (preparação); finalizar após AG-07

Use prompt integral AG-10 do `PROMPTS.md`. Preparar Cloudflare Pages (Vite build `npm run build`, output `dist`), **sem vars Supabase**, sem mexer nos arquivos `src/services` sob AG-07. Primeiro, executar QA dos fluxos em preview/local e screenshots reais: landing, B/brief, A/90, AC/clusters, startup/response, regional; verificar carregamento direto de rotas profundas, refresh, HTTPS em acesso externo, celular/teclado, zoom, aviso sintético e ausência de segredos. Depois do commit AG-07 fazer pull, executar `npm ci && npm run check`, smoke A/B/C/cluster e capturar resultado em `docs/QA_REPORT.md`. **CT-10/CT-12 e RLS remoto = não executados**, não 'pass'. Publicar link de Cloudflare **somente se houver acesso e verificação real**. Se indisponível: plano B de gravar vídeo do localhost, sem anunciar URL pública.

**Definição de pronto release estático:** resultado A/B/C real no browser, rotas profundas, identificação de simulação, no exposed secrets e gravação sem travamentos; link testado se houver deploy. Não prometer persistência remota.

## 3 — AG-11 imediatamente em paralelo (gravação)

Roteiro de até 3 minutos (ajustar ao regulamento real da banca):

| Janela aproximada | Tela / fala |
| --- | --- |
| 0:00–0:25 | Dor do pequeno lojista: WhatsApp, demora e perda de oportunidade ao confirmar estoque, sem inventar métricas de mercado |
| 0:25–0:50 | DEMANDA VIVA: entrevista guiada transforma dor em requisitos verificáveis; dados 100% fictícios |
| 0:50–1:20 | Caso B sem ERP: EstoquePonte requer ERP X, é inelegível SEM score; gera briefing para revisão da AC |
| 1:20–1:55 | Painel AC: quatro relatos de duas ACs fictícias, cluster candidato e proposta de chamada; resposta de startup é simulação |
| 1:55–2:25 | Caso A com ERP X: gates elegíveis, score calculado 90/100 e evidências simuladas; não é decisão automática final |
| 2:25–2:45 | Visão regional: importância da recorrência de demandas para rede de ACs (indicadores sintéticos) |
| 2:45–3:00 | Fecho: demanda vira oportunidade mesmo quando não há match; MVP demonstrativo, persistência Supabase preparada no código mas não ativada até aprovação de segurança |

**Plano B:** se Cloudflare falhar, gravar navegação local ou usar capturas reais `docs/ag09-screenshots/`, deixando claro que a publicação remota não foi verificada. Não prometer startup, piloto ou associação real. O slogan é recomendação, não marca institucional aprovada.

## 4 — Último checklist antes de enviar

- [ ] Git commit AG-07 e `npm run check` após integração; testes do motor REAL em vez do referenceMatcher
- [ ] AG-10 QA_REPORT com casos efetivamente executados e bloqueados
- [ ] Link Pages acessível em janela anônima e refresh de rota profunda, **se** deploy publicado
- [ ] Site e vídeo sem claims de 'salvo na nuvem', login real, dados reais ou critérios oficiais FACESP
- [ ] Vídeo com fala, telas e áudio verificados localmente e arquivo exportado no formato de entrega
- [ ] Materiais finais enviados no portal do hackathon; verificar confirmação de recebimento

**Não deve bloquear a entrega estática:** Supabase não configurado, RPC de projeção não aprovada, quinta demanda não sincronizada. **Deve bloquear qualquer alegação remota:** ausência de RLS/antiabuso/CT-10/12 comprovados.
