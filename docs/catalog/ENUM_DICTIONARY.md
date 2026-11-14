# AG-05 — Dicionário canônico de códigos (DATA_MODEL v1.0.0)

**Origem:** `DATA_MODEL.md` aprovado no gate G1 do DEMANDA VIVA (AG-01), Doc 02. **Uso:** chaves técnicas estáveis para `src/data/*` e testes, não criar enums concorrentes. Rótulos para interface em `src/data/catalog-enums.ts`. **Todos os registros do catálogo são sintéticos.**

| Tipo AG-01 | Códigos exatos | Uso no catálogo |
|---|---|---|
| `AssociationCode` | `ac_alfa`, `ac_beta` | Atores AC sintéticos; território fixo `regional_demo` |
| `SegmentCode` | `stationery`, `fashion`, `housewares`, `gifts`, `grocery`, `other` | Filtro de segmento; `other` **não** significa todos |
| `SizeCode` | `micro`, `small` | Filtro de porte |
| `ChannelCode` | `whatsapp`, `counter`, `ecommerce`, `mixed` | Filtro de canal; *mixed* precisa estar declarado |
| `PainCode` | `stock_confirmation_delay`, `sales_reconciliation`, `customer_follow_up` | Filtro de função essencial |
| `ProcessCode` | `visual_check`, `spreadsheet_check`, `manual_message`, `erp_lookup`, `other` | Diagnóstico; não confundir processo manual com integração ERP |
| `FrequencyCode` | `daily`, `weekly`, `monthly` | Ficha de demanda, não pontuação direta |
| `ErpCode` | `erp_x` | Sistema fictício indispensável para EstoquePonte e VisorDeLegado; `null` significa nenhum ERP |
| `RequirementCode` | `stock_lookup`, `whatsapp_workflow`, `multi_store`, `no_erp_dependency`, `mobile_access`, `manual_stock_update`, `privacy_preserving`, `short_training` | Requisitos com `mandatory` ou `optional`; não inventar códigos |
| `MetricCode` | `confirmation_minutes`, `hours_per_week`, `error_rate_pct` | Resultado/piloto, com meta melhor que linha de base |
| `BudgetBand` | `low`, `medium`, `high` | Tetos mensais **fictícios** R$ 200, R$ 500, R$ 1.000, respectivamente |
| `DataSharing` | `none`, `restricted`, `allowed` | Limite de compartilhamento da demanda e exigência da solução |
| `NeedOrigin` | `seed`, `scenario_fixture`, `remote` | Catálogo não é remoto; A/C testes e 4 seeds B são locais |
| `NeedStatus` persistível | `qualified` | Somente ficha confirmada pode ser persistida; `draft/insufficient_data` são locais |
| `CurationStatus` | `received`, `under_review`, `validated_for_demo`, `suspended`, `expired` | Não equivale a homologação/validação externa; `validated_for_demo` é somente simulação |
| `GateCode` | `essential_function`, `technical_dependencies`, `hard_budget`, `data_privacy`, `coverage`, `curation_evidence` | Executar **antes** das notas |
| `ScoreCriterion` | `functional`, `technical`, `economic`, `operation`, `evidence` | Pesos 30/20/20/15/15, ratings inteiros 0..5 |
| `ApprovalMode` | `simulated` | Nenhuma aprovação real pelo seletor de AC |
| `CatalogEvidence.kind` | `demo`, `documentation`, `pilot`, `reference` | Tipo de artefato **inventado** |
| `CatalogEvidence.sourceMode` | `synthetic` | Único valor permitido na demonstração; não há fontes verificadas reais |
| `CatalogEvidence.reviewStatus` | `valid_for_demo`, `expired`, `pending` | Vigência simulada, com datas UTC |

## Gates e sua precedência

1. `essential_function`: `PainCode` e funções obrigatórias do diagnóstico.
2. `technical_dependencies`: ERP X, dependência sem ERP, treinamento/capacidade e operação offline.
3. `hard_budget`: `minimumMonthlyCostCents` vs teto; `null` ⇒ `unknown`, nunca zero.
4. `data_privacy`: fornecedor não pode pedir mais compartilhamento que o permitido; requisitos de privacidade obrigatórios precisam de cobertura.
5. `coverage`: segmento, porte, canal, regional demonstrativa e requisito de acesso móvel.
6. `curation_evidence`: ficha válida `validated_for_demo`, data vigente e pelo menos uma evidência **sintética** vigente.

**Resultado do gate:** `fail` ⇒ `ineligible` e não possui propriedade `score`; `unknown` sem `fail` ⇒ `needs_information` sem `score`; seis `pass` ⇒ calcular notas de 0 a 5, pesos 30/20/20/15/15 e decisão `>=80` recomendado sujeito à AC, `65–<80` condicional, `<65` não recomendado. São **critérios propostos pela equipe**, não regras oficiais FACESP.

**Versionamento:** `schemaVersion=1`, `catalogVersion='catalog-v1'`, `MATCH_RULES_VERSION='match-v1'`. Mudar semântica, categoria, peso, threshold ou ID exige registro no PMO/`DECISIONS.md`.
