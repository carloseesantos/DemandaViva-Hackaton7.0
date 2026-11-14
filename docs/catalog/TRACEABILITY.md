# AG-05 — Matriz requisito → solução → gate

**Data-base da avaliação de demonstração:** 14/11/2026, horário UTC correspondente; versões `DATA_MODEL v1.0.0`, `catalog-v1`, `match-v1`. Todos os fornecedores e fatos são **100% SIMULADOS**. Legenda de soluções: **EP** = `solution:estoqueponte-v1`; **CC** = `solution:caixaclara-v1`; **VR** = `solution:vitrineretorno-v1`; **FR** = `solution:fechorapido-v1`; **VL** = `solution:visordelegado-v1`.

| Requisito canônico | Soluções que declaram cobertura | Gate eliminatório responsável | Observação de elegibilidade |
|---|---|---|---|
| `stock_lookup` | **EP**, VL | `essential_function` + `technical_dependencies` + `curation_evidence` | EP e VL exigem **ERP X**; VL está **expirada**. Zero alternativa validada sem ERP para B |
| `whatsapp_workflow` | EP, **VR** | `essential_function` e `coverage` | VR trata **relacionamento**, não estoque; coincidência no canal não substitui função essencial |
| `multi_store` | **EP**, VL | `essential_function`, `technical_dependencies` | Consulta multiunidade da EP depende de ERP X |
| `no_erp_dependency` | **Nenhuma solução de estoque** | `technical_dependencies` | B exige este requisito; EP e VL falham. CC/VR/FR não resolvem a dor central de B |
| `mobile_access` | EP, CC, **VR**, VL | `coverage` | FR não declara suporte móvel. Suporte móvel não implica consulta de estoque |
| `manual_stock_update` | Nenhuma | `essential_function` | Se obrigatório, nenhuma ficha de estoque pode ser recomendada; abrir briefing sem ERP |
| `privacy_preserving` | EP, CC, VR, FR, VL | `data_privacy` | Verificar também `dataSharingRequired` contra `NeedConstraints.dataSharing` |
| `short_training` | EP, CC, FR | `technical_dependencies` | VR tem treinamento estimado em 3h (não atende exigência `short_training`); FR não possui horas confirmadas |

## Matriz completa de soluções e gates

| Solução | Dor atendida | Sistema exigido | Preço mensal mínimo fictício | Status em 14/11/2026 | Implicação A / B / outros |
|---|---|---|---|---|---|
| **EP EstoquePonte** | `stock_confirmation_delay` | `erp_x` obrigatório | R$ 199 | `validated_for_demo`; três evidências simuladas vigentes | **A:** seis gates pass, `90` calculado. **B:** `technical_dependencies=fail` por ausência ERP X, sem score |
| **CC CaixaClara** | `sales_reconciliation` | nenhum | R$ 89 | `validated_for_demo`; duas evidências simuladas vigentes | B: `essential_function=fail`, não resolve estoque |
| **VR VitrineRetorno** | `customer_follow_up` | nenhum | R$ 180 | `validated_for_demo`; duas evidências simuladas vigentes | B: `essential_function=fail`. D: `conditional` com 72 calculado, pois desejável `short_training` não é atendido e implantação é 14h |
| **FR FechoRápido** | `sales_reconciliation` | nenhum | **unknown / null** | `under_review`; evidência pendente | B: `essential_function=fail`; cenário E: `hard_budget=unknown`, `curation_evidence=unknown` e sem score |
| **VL VisorDeLegado** | `stock_confirmation_delay` | `erp_x` obrigatório | R$ 149 (ficha expirada) | `expired`, 01/10/2026; evidência expirada | B: ERP X ausente; A: `curation_evidence=fail`; nunca pontuar nem recomendar |

## Condições de não regressão dos cenários

- **A — cenário canônico separado:** papelaria de duas unidades, usa `erp_x`; `stock_lookup`, `multi_store` obrigatórios; WhatsApp; faixa `medium`; suporte em até 4h de treinamento. Resultado: EP com notas **derivadas** `5,5,4,4,4`, score `90` (soma 30+20+16+12+12). Nenhum `score=90` é armazenado no catálogo.
- **B — um dos quatro seeds sem ERP:** planilha e WhatsApp, `stock_lookup` e `no_erp_dependency` obrigatórios, faixa `low`, mobile, treinamento até 2h. **Todos os cinco produtos são inelegíveis**, por função/ERP/curadoria. A EP não recebe score; segue briefing de no-match **no catálogo consultado**.
- **C — diagnóstico incompleto:** `NeedDraft.localOnly=true`, `status='insufficient_data'`, faltam ERP/requisitos/restrições/métrica; nenhuma busca pontuada e nenhum INSERT.
- **D — condicional/limitação:** follow-up WhatsApp, dois obrigatórios + dois desejáveis; a VR cobre somente 1/2 dos desejáveis, implantação fictícia de 14h e duas evidências artificiais ⇒ notas `3,5,4,3,3` ⇒ **72**, faixa condicional.
- **E — curadoria:** VL expirada e FR com preço/implantação unknown nunca geram score ou recomendação definitiva.

## Matriz de integridade das evidências

| Solução | IDs de evidência | Natureza | Validade máxima fictícia |
|---|---|---|---|
| EP | `ev:estoqueponte:demo`, `ev:estoqueponte:documentation`, `ev:estoqueponte:pilot` | Demonstração, documento, piloto **inventados** | 28/02/2027 |
| CC | `ev:caixaclara:demo`, `ev:caixaclara:documentation` | Demonstração/documento **inventados** | 31/01/2027 |
| VR | `ev:vitrineretorno:demo`, `ev:vitrineretorno:documentation` | Demonstração/documento **inventados** | 15/01/2027 |
| FR | `ev:fechorapido:documentation` | Ficha **inventada, pendente** | 31/01/2027, porém NÃO validada |
| VL | `ev:visordelegado:pilot` | Piloto **inventado, expirado** | 01/10/2026 |

**Evidência verificável real:** **nenhuma**. O catálogo não contém URL de fornecedor real, CNPJ, contato, acordo, aprovação de AC, FACESP ou credencial de homologação. As únicas fontes documentais reais consultadas são os Docs 00–03, ADR-002 e contrato AG-01, que descrevem a **metodologia proposta**, não a veracidade dos fornecedores.
