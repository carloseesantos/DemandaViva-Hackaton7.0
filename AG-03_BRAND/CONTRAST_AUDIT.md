# DEMANDA VIVA — Auditoria de contraste dos tokens

**AG-03 · 14/11/2026 · Paleta 01 “Ponte Viva” proposta.**

Contraste calculado com luminância relativa sRGB conforme a fórmula WCAG. Critério: texto normal ≥4,5:1; componentes não textuais e foco ≥3,0:1. Valores arredondados a duas casas para apresentação; a aprovação é feita com precisão completa.

| Par de uso | Primeiro HEX / Segundo HEX | Razão | Limiar | Resultado |
|---|---|---:|---:|---|
| Texto principal / superfície | `#11273A` / `#FFFFFF` | **15.27:1** | 4.5:1 | PASSA |
| Texto principal / fundo | `#11273A` / `#F7FAFC` | **14.57:1** | 4.5:1 | PASSA |
| Texto secundário / superfície | `#52687A` / `#FFFFFF` | **5.80:1** | 4.5:1 | PASSA |
| Texto secundário / fundo | `#52687A` / `#F7FAFC` | **5.53:1** | 4.5:1 | PASSA |
| CTA primário (texto branco) | `#FFFFFF` / `#075E6B` | **7.44:1** | 4.5:1 | PASSA |
| CTA em hover (texto branco) | `#FFFFFF` / `#064C58` | **9.62:1** | 4.5:1 | PASSA |
| Texto/links petróleo / superfície | `#075E6B` / `#FFFFFF` | **7.44:1** | 4.5:1 | PASSA |
| Botão secundário | `#075E6B` / `#E8F7F5` | **6.75:1** | 4.5:1 | PASSA |
| Borda funcional / superfície | `#748D9B` / `#FFFFFF` | **3.48:1** | 3.0:1 | PASSA |
| Borda funcional / fundo | `#748D9B` / `#F7FAFC` | **3.32:1** | 3.0:1 | PASSA |
| Foco / superfície | `#075E6B` / `#FFFFFF` | **7.44:1** | 3.0:1 | PASSA |
| Recomendado | `#166534` / `#ECFDF3` | **6.76:1** | 4.5:1 | PASSA |
| Condicional | `#854D0E` / `#FEF3C7` | **6.15:1** | 4.5:1 | PASSA |
| Inelegível | `#991B1B` / `#FEF2F2` | **7.60:1** | 4.5:1 | PASSA |
| Insuficiente | `#075985` / `#E0F2FE` | **6.59:1** | 4.5:1 | PASSA |
| Processando | `#475569` / `#F1F5F9` | **6.92:1** | 4.5:1 | PASSA |
| Offline | `#9A3412` / `#FFF7ED` | **6.88:1** | 4.5:1 | PASSA |
| Demonstração | `#164E63` / `#ECFEFF` | **8.76:1** | 4.5:1 | PASSA |

**Resultado da amostra de tokens funcionais:** 18/18 pares testados passam no respectivo limiar.

## Cores intencionalmente não utilizadas para texto/controle essencial

- Acento verde-água `#25BAA7` sobre branco `#FFFFFF`: **2.42:1** — NÃO serve para texto normal nem para um ícone que sozinho identifica uma ação.
- Texto branco `#FFFFFF` sobre verde-água `#25BAA7`: **2.42:1** — NÃO usar em botão com texto pequeno.
- Borda decorativa de cartão `#C6D5DD` sobre branco: **1.50:1** — não delimita campo interativo por si; campo deve usar `#748D9B` e foco explícito.

## Limites da verificação

- **Isto é uma auditoria de pares HEX, não certificação WCAG da SPA.** Tipografia renderizada, opacidade, overlays, foco, componente desabilitado e temas reais ainda exigem QA de AG-09/AG-10.
- O favicon deve ser inspecionado em 16×16 e 32×32; por ser símbolo decorativo sem texto, identificação do produto continua no header acessível.
- Paletas 02/03 são exploratórias. Nenhum token delas é aprovado para produção e não estão cobertas por todos os pares de estado.
- Contrastes visuais dos SVGs precisam ser revalidados se os textos forem convertidos em curvas, suas cores mudarem ou forem usados sobre fotos.

## Reprodutibilidade

Executar `python audit_contrast.py` na pasta do pacote, usando `tokens.json` como fonte única. O script gera este relatório e interrompe com erro se um par funcional ficar abaixo do limite.
