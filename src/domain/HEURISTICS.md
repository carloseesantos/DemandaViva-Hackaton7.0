# Heurística match-v1 / cluster-signature-v1 (AG-07)

**Natureza:** protocolo **proposto pela equipe** (Doc 02 / DATA_MODEL). **Não** são critérios oficiais FACESP.

## Ordem determinística

1. Validar/qualificar a necessidade (`validateNeed` / `qualifyNeed`).
2. Se incompleta → `insufficient_data` (nunca “não-match”).
3. Para cada solução do catálogo (ordenada por `id`):
   - Avaliar **seis gates** na ordem: função → sistemas/integração → teto rígido → dados/privacidade → cobertura → evidências/validade.
   - Qualquer `fail` → `ineligible` **sem score**.
   - Sem fail, com `unknown` essencial (preço, curadoria, evidência, implantação) → `needs_information` **sem score**.
   - Seis `pass` → `calculateCompatibilityScore`.
4. Rankear elegíveis por score desc, empate por `solutionId` asc.
5. Sem elegíveis e sem `needs_information` → caminho B + `generateBriefing`.
6. Clusters via `detectSimilarNeeds` (sempre `review.status=suggested`).

## Pesos e faixas (imutáveis sem decisão PMO)

| Critério | Peso |
| --- | ---: |
| functional | 30 |
| technical | 20 |
| economic | 20 |
| operation | 15 |
| evidence | 15 |

`score = Σ (weight × rating / 5)` com `rating ∈ {0…5}` inteiro.  
Faixas: `≥80` recommended · `≥65` conditional · `<65` not_recommended.

## Notas (derivação)

- **functional:** cobertura ponderada de requisitos opcionais (sem opcionais → 5).
- **technical:** 5 após o gate técnico passar.
- **economic:** razão `custoMínimo / tetoDaFaixa` (≤0,3→5 … ≤1→2).
- **operation:** horas de implantação (≤4→5 … ≤48→2).
- **evidence:** contagem de evidências sintéticas vigentes (3→4, etc.).

Cenário A (EstoquePonte): notas `5,5,4,4,4` → **90** calculado.

## Cluster

Assinatura base: `painCode|processFamily|erpContext|channelCode`.  
Partição dura adicional: `metricCode|dataSharing|offline`.  
Diferenças de segmento/processo/porte/orçamento/treinamento/requisitos → `variations` + `blockingConflicts`.  
Texto idêntico com contexto diferente (ex.: D digital/ERP) **não** compartilha assinatura com seeds B.

## Limitações

- Evidências, preços e pilots são 100% simulados.
- Aprovação AC e chamada a startup são simulações de UI.
- Fatos móveis/offline/treinamento vêm de metadados operacionais injetados pelo serviço (catálogo AG-05), não do tipo `Solution` congelado.
