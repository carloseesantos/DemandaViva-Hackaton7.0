# Capturas de estado — AG-09

Roteiro para AG-10 gerar PNGs oficiais (dev server ou Pages):

| Arquivo sugerido | Rota / ação |
|---|---|
| `01-home.png` | `/` — marca DEMANDA + selo demo |
| `02-interview.png` | `/lojista/diagnostico` — etapa 1 |
| `03-result-b.png` | `/lojista/resultado/e0a11000-0000-4000-8000-000000000001` — B sem score |
| `04-result-a.png` | `/lojista/resultado/a0a11000-0000-4000-8000-000000000001` — A 90/100 |
| `05-brief.png` | briefing a partir do resultado B |
| `06-ac-panel.png` | `/ac/painel` — 4 seeds, contagem real |
| `07-startup.png` | chamada/resposta simulada |
| `08-regional.png` | `/regional` — agregados |
| `09-sync-failed.png` | após confirmar B sem Supabase — status não sincronizada |

Comandos de apoio:
```bash
npm run dev
npm run build && npx wrangler pages dev dist --port 8788
```
