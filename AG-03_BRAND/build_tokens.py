import json, pathlib
p=pathlib.Path('/mnt/data/demanda-viva-ag03')
obj={
 '$schema':'https://design-tokens.github.io/community-group/format/',
 'name':'DEMANDA VIVA — Ponte Viva',
 'version':'1.0.0-proposal',
 'status':'Proposta AG-03; aprovação pela equipe pendente',
 'color':{
  'ink':'#11273A','primary':'#075E6B','primaryHover':'#064C58','accent':'#25BAA7',
  'background':'#F7FAFC','surface':'#FFFFFF','text':'#11273A','textMuted':'#52687A','border':'#748D9B','borderSubtle':'#C6D5DD','focus':'#075E6B',
  'onPrimary':'#FFFFFF','accentSoft':'#E8F7F5',
  'recommendedText':'#166534','recommendedBg':'#ECFDF3',
  'conditionalText':'#854D0E','conditionalBg':'#FEF3C7',
  'ineligibleText':'#991B1B','ineligibleBg':'#FEF2F2',
  'insufficientText':'#075985','insufficientBg':'#E0F2FE',
  'processingText':'#475569','processingBg':'#F1F5F9',
  'offlineText':'#9A3412','offlineBg':'#FFF7ED',
  'demoText':'#164E63','demoBg':'#ECFEFF'
 },
 'font':{'family':'Manrope, Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif',
         'weight':{'regular':400,'medium':500,'semibold':600,'bold':700,'extrabold':800},
         'size':{'caption':'0.875rem','body':'1rem','h3':'1.25rem','h2':'1.5rem','h1':'2rem','score':'2rem'},
         'lineHeight':{'caption':1.43,'body':1.5,'heading':1.25,'score':1.25}},
 'space':{'1':'0.25rem','2':'0.5rem','3':'0.75rem','4':'1rem','5':'1.25rem','6':'1.5rem','8':'2rem','10':'2.5rem','12':'3rem'},
 'radius':{'control':'0.5rem','card':'0.75rem','feature':'1rem','pill':'999px'},
 'elevation':{'card':'0 2px 12px rgba(17,39,58,.06)','hover':'0 6px 24px rgba(17,39,58,.10)'},
 'layout':{'content':'70rem','diagnostic':'45rem','touchTarget':'2.75rem'},
 'motion':{'fast':'120ms','normal':'180ms','expand':'200ms','easing':'cubic-bezier(0.2, 0, 0, 1)'}
}
(p/'tokens.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
lines=['/* Demanda Viva / AG-03 / Direção 01: Ponte Viva */',
 '/* Sem garantia de aprovação; tokens de marca propostos. */',':root {']
for k,v in obj['color'].items():
 import re
 kebab=re.sub('([a-z0-9])([A-Z])',r'\1-\2',k).lower()
 lines.append(f'  --dv-color-{kebab}: {v};')
lines += ['  --dv-font-family: '+obj['font']['family']+';']
for k,v in obj['font']['weight'].items():lines.append(f'  --dv-font-weight-{k}: {v};')
for k,v in obj['font']['size'].items():lines.append(f'  --dv-font-size-{k}: {v};')
for k,v in obj['space'].items():lines.append(f'  --dv-space-{k}: {v};')
for k,v in obj['radius'].items():lines.append(f'  --dv-radius-{k}: {v};')
for k,v in obj['elevation'].items():lines.append(f'  --dv-shadow-{k}: {v};')
for k,v in obj['layout'].items():
 import re
 kebab=re.sub('([a-z0-9])([A-Z])',r'\1-\2',k).lower()
 lines.append(f'  --dv-layout-{kebab}: {v};')
for k,v in obj['motion'].items():lines.append(f'  --dv-motion-{k}: {v};')
lines += ['}', '',
 '/* Primitivos opcionais para AG-09; não sobrepõem lógica de produto. */',
 '.dv-app { font-family: var(--dv-font-family); color: var(--dv-color-text); background: var(--dv-color-background); line-height: 1.5; }',
 '.dv-surface { background: var(--dv-color-surface); border: 1px solid var(--dv-color-border-subtle); border-radius: var(--dv-radius-card); box-shadow: var(--dv-shadow-card); }',
 '.dv-focusable:focus-visible { outline: 3px solid var(--dv-color-focus); outline-offset: 2px; }',
 '.dv-visually-hidden { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }',
 '/* Contraste de acessibilidade nunca depende apenas do background do badge. */',
 '.dv-status--recommended { color: var(--dv-color-recommended-text); background: var(--dv-color-recommended-bg); }',
 '.dv-status--conditional { color: var(--dv-color-conditional-text); background: var(--dv-color-conditional-bg); }',
 '.dv-status--ineligible { color: var(--dv-color-ineligible-text); background: var(--dv-color-ineligible-bg); }',
 '.dv-status--insufficient { color: var(--dv-color-insufficient-text); background: var(--dv-color-insufficient-bg); }',
 '.dv-status--processing { color: var(--dv-color-processing-text); background: var(--dv-color-processing-bg); }',
 '.dv-status--offline { color: var(--dv-color-offline-text); background: var(--dv-color-offline-bg); }',
 '.dv-status--demo { color: var(--dv-color-demo-text); background: var(--dv-color-demo-bg); }',
 '@media (prefers-reduced-motion: reduce) { .dv-app *, .dv-app *::before, .dv-app *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; } }',
 '@media (forced-colors: active) { .dv-focusable:focus-visible { outline-color: Highlight; } .dv-surface { border: 1px solid CanvasText; } }',
]
(p/'tokens.css').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('tokens generated')
