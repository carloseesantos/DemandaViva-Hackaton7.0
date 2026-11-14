# Pacote AG-03 — DEMANDA VIVA

**Entrega:** 14/11/2026 · **Versão:** 1.0 · **Natureza:** proposta visual sujeita a aprovação.

## Inventário

- `BRAND_SYSTEM.md` — decisão, três direções, recomendação, logo, acessibilidade, desktop/mobile/pitch, handoffs.
- `UI_COMPONENT_GUIDE.md` — especificação de botões, cartões, status, formulários e responsividade.
- `APPLICATION_EXAMPLES.md` — snippets de header e resultados A/B/C, estados de salvamento; sem criar telas integrais.
- `tokens.css` e `tokens.json` — tokens semânticos da direção recomendada.
- `logo-horizontal.svg` e `logo-compact.svg` — logotipos tipográficos propostos, texto editável e peso DEMANDA > VIVA.
- `favicon.svg` — símbolo simplificado sem abreviação ‘DV’.
- `directions-board.svg` — quadro comparativo de 3 direções, para avaliação da equipe.
- `CONTRAST_AUDIT.md` — razões de contraste computadas para pares de uso.
- `HANDOFF_AG03.md` — resumo operacional para AG-09 e AG-11.

## Integração sugerida

Em React/Vite, copiar `tokens.css` para `src/styles/brand-tokens.css` e SVGs para `public/brand/`. Referenciar `favicon.svg` no `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/brand/favicon.svg" />
```

A fonte **Manrope** é open-source (SIL OFL); incluir com licença e fallback apropriados. O lettering dos SVGs usa `<text>` editável; para garantir fidelidade cross-platform em produção, exportar a wordmark em contornos após aprovação da equipe. O favicon é baseado em `<path>`/`circle` e independente de fontes.

**Não contém** logo oficial FACESP, dados de empresas reais, nem telas completas do AG-04. Não garante registrabilidade do nome ou conformidade WCAG da SPA final.
