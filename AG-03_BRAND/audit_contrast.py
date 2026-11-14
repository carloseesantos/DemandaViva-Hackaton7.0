import json, pathlib
p=pathlib.Path(__file__).parent
c=json.loads((p/'tokens.json').read_text(encoding='utf-8'))['color']
def luminance(value):
 h=value.replace('#',''); vs=[int(h[i:i+2],16)/255 for i in (0,2,4)]
 vs=[v/12.92 if v<=0.04045 else ((v+0.055)/1.055)**2.4 for v in vs]
 return vs[0]*0.2126+vs[1]*0.7152+vs[2]*0.0722
def contrast(a,b):
 l,m=sorted([luminance(a),luminance(b)])
 return (m+0.05)/(l+0.05)
checks=[
 ('Texto principal / superfície','text','surface',4.5,'Texto normal'),
 ('Texto principal / fundo','text','background',4.5,'Texto normal'),
 ('Texto secundário / superfície','textMuted','surface',4.5,'Texto normal'),
 ('Texto secundário / fundo','textMuted','background',4.5,'Texto normal'),
 ('CTA primário (texto branco)','onPrimary','primary',4.5,'Texto normal'),
 ('CTA em hover (texto branco)','onPrimary','primaryHover',4.5,'Texto normal'),
 ('Texto/links petróleo / superfície','primary','surface',4.5,'Texto normal'),
 ('Botão secundário','primary','accentSoft',4.5,'Texto normal'),
 ('Borda funcional / superfície','border','surface',3.0,'Componente não textual'),
 ('Borda funcional / fundo','border','background',3.0,'Componente não textual'),
 ('Foco / superfície','focus','surface',3.0,'Indicador não textual'),
 ('Recomendado','recommendedText','recommendedBg',4.5,'Texto normal'),
 ('Condicional','conditionalText','conditionalBg',4.5,'Texto normal'),
 ('Inelegível','ineligibleText','ineligibleBg',4.5,'Texto normal'),
 ('Insuficiente','insufficientText','insufficientBg',4.5,'Texto normal'),
 ('Processando','processingText','processingBg',4.5,'Texto normal'),
 ('Offline','offlineText','offlineBg',4.5,'Texto normal'),
 ('Demonstração','demoText','demoBg',4.5,'Texto normal'),
]
lines=['# DEMANDA VIVA — Auditoria de contraste dos tokens', '',
 '**AG-03 · 14/11/2026 · Paleta 01 “Ponte Viva” proposta.**', '',
 'Contraste calculado com luminância relativa sRGB conforme a fórmula WCAG. Critério: texto normal ≥4,5:1; componentes não textuais e foco ≥3,0:1. Valores arredondados a duas casas para apresentação; a aprovação é feita com precisão completa.', '',
 '| Par de uso | Primeiro HEX / Segundo HEX | Razão | Limiar | Resultado |', '|---|---|---:|---:|---|']
fails=[]
for desc,fg,bg,lim,role in checks:
 a,b=c[fg],c[bg]; ratio=contrast(a,b); status='PASSA' if ratio>=lim else 'FALHA'
 if ratio<lim: fails.append(desc)
 lines.append(f'| {desc} | `{a}` / `{b}` | **{ratio:.2f}:1** | {lim:.1f}:1 | {status} |')
# intentional noncompliant decor pairs
r=contrast(c['accent'],c['surface']); r2=contrast(c['onPrimary'],c['accent']);r3=contrast(c['borderSubtle'],c['surface'])
lines += ['',f'**Resultado da amostra de tokens funcionais:** {len(checks)-len(fails)}/{len(checks)} pares testados passam no respectivo limiar.' if not fails else f'**Falhas:** {", ".join(fails)}', '',
 '## Cores intencionalmente não utilizadas para texto/controle essencial', '',
 f'- Acento verde-água `#25BAA7` sobre branco `#FFFFFF`: **{r:.2f}:1** — NÃO serve para texto normal nem para um ícone que sozinho identifica uma ação.',
 f'- Texto branco `#FFFFFF` sobre verde-água `#25BAA7`: **{r2:.2f}:1** — NÃO usar em botão com texto pequeno.',
 f'- Borda decorativa de cartão `#C6D5DD` sobre branco: **{r3:.2f}:1** — não delimita campo interativo por si; campo deve usar `#748D9B` e foco explícito.',
 '', '## Limites da verificação', '',
 '- **Isto é uma auditoria de pares HEX, não certificação WCAG da SPA.** Tipografia renderizada, opacidade, overlays, foco, componente desabilitado e temas reais ainda exigem QA de AG-09/AG-10.',
 '- O favicon deve ser inspecionado em 16×16 e 32×32; por ser símbolo decorativo sem texto, identificação do produto continua no header acessível.',
 '- Paletas 02/03 são exploratórias. Nenhum token delas é aprovado para produção e não estão cobertas por todos os pares de estado.',
 '- Contrastes visuais dos SVGs precisam ser revalidados se os textos forem convertidos em curvas, suas cores mudarem ou forem usados sobre fotos.',
 '', '## Reprodutibilidade', '',
 'Executar `python audit_contrast.py` na pasta do pacote, usando `tokens.json` como fonte única. O script gera este relatório e interrompe com erro se um par funcional ficar abaixo do limite.',
]
(p/'CONTRAST_AUDIT.md').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print(f'Tested {len(checks)}, failures {len(fails)}; accent contrast {r:.2f}; decor {r3:.2f}')
if fails: raise SystemExit(1)
