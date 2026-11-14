from pathlib import Path
from xml.sax.saxutils import escape
p=Path('/mnt/data/demanda-viva-ag03')
rows=[
 dict(y=155,name='01 — PONTE VIVA',subtitle='Confiança + acolhimento • RECOMENDADA',bg='#F4FAFA',ink='#11273A',secondary='#075E6B',accent='#25BAA7',cta='#075E6B',font='Manrope,Inter,Arial,sans-serif',mark='branch'),
 dict(y=390,name='02 — MERCADO EM MOVIMENTO',subtitle='Energia de mercado + inovação',bg='#F3F6FF',ink='#182B62',secondary='#3152CC',accent='#EF9547',cta='#3152CC',font='Sora,Inter,Arial,sans-serif',mark='bars'),
 dict(y=625,name='03 — SINAL DE OPORTUNIDADE',subtitle='Precisão + rede contemporânea',bg='#F2F5E8',ink='#1F2D2F',secondary='#50672A',accent='#A9CD47',cta='#1F2D2F',font='Plus Jakarta Sans,Inter,Arial,sans-serif',mark='route'),
]
svg=['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 870" width="1200" height="870" role="img" aria-labelledby="ttl">',
'<title id="ttl">Demanda Viva — três direções propostas de identidade visual</title>',
'<rect width="1200" height="870" fill="#F6F8FA"/>',
'<text x="60" y="55" font-family="Inter,Arial,sans-serif" font-size="28" font-weight="800" fill="#11273A">DEMANDA VIVA</text>',
'<text x="60" y="89" font-family="Inter,Arial,sans-serif" font-size="17" fill="#52687A">Exploração visual · AG-03 · 14/11/2026 · marca aprovada, direções em proposta</text>']
for r in rows:
 y=r['y']; ink=r['ink'];sec=r['secondary'];a=r['accent']; bg=r['bg']; font=r['font']
 svg+=[f'<rect x="50" y="{y-33}" width="1100" height="215" rx="20" fill="{bg}" stroke="#CED9DE" stroke-width="1"/>',
 f'<text x="78" y="{y+2}" font-family="Inter,Arial,sans-serif" font-size="21" font-weight="700" fill="{ink}">{escape(r["name"])}</text>',
 f'<text x="78" y="{y+29}" font-family="Inter,Arial,sans-serif" font-size="14" fill="{ink}">{escape(r["subtitle"])}</text>']
 if r['mark']=='branch':
  svg+= [f'<rect x="78" y="{y+52}" width="76" height="76" rx="17" fill="#E8F7F5"/>',f'<path d="M97 {y+91}H114L137 {y+70}M114 {y+91}L137 {y+113}" fill="none" stroke="{sec}" stroke-width="5" stroke-linecap="round"/>', f'<circle cx="96" cy="{y+91}" r="6" fill="{ink}"/><circle cx="138" cy="{y+69}" r="7" fill="{a}"/><circle cx="138" cy="{y+114}" r="7" fill="{sec}"/>']
 if r['mark']=='bars':
  svg += [f'<rect x="78" y="{y+52}" width="76" height="76" rx="17" fill="#E1E9FF"/>',f'<rect x="92" y="{y+88}" width="10" height="22" rx="4" fill="{ink}"/><rect x="108" y="{y+76}" width="10" height="34" rx="4" fill="{sec}"/><rect x="124" y="{y+66}" width="10" height="44" rx="4" fill="{a}"/>']
 if r['mark']=='route':
  svg +=[f'<rect x="78" y="{y+52}" width="76" height="76" rx="17" fill="#E5EDCE"/>',f'<path d="M98 {y+108}V{y+76}H136M114 {y+76}V{y+104}H136" stroke="{sec}" fill="none" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="98" cy="{y+108}" r="6" fill="{ink}"/><circle cx="136" cy="{y+76}" r="6" fill="{a}"/><circle cx="136" cy="{y+104}" r="6" fill="{ink}"/>']
 svg +=[f'<text x="174" y="{y+99}" font-family="{font}" font-size="43" font-weight="800" letter-spacing="-1.7" fill="{ink}">DEMANDA</text>',f'<text x="420" y="{y+99}" font-family="{font}" font-size="30" font-weight="600" letter-spacing="-0.8" fill="{sec}">VIVA</text>',f'<text x="785" y="{y+77}" fill="{ink}" font-family="Inter,Arial,sans-serif" font-size="15">Necessidades que viram</text>',f'<text x="785" y="{y+98}" fill="{ink}" font-family="Inter,Arial,sans-serif" font-size="15">oportunidades.</text>',f'<rect x="785" y="{y+112}" width="190" height="38" rx="8" fill="{r["cta"]}"/>',f'<text x="805" y="{y+137}" fill="#FFFFFF" font-family="Inter,Arial,sans-serif" font-size="15" font-weight="600">Iniciar diagnóstico</text>']
 for i,col in enumerate([ink,sec,a,bg]):svg.append(f'<rect x="{1000+i*32}" y="{y+72}" width="25" height="25" rx="5" fill="{col}" stroke="#D5E0E4"/>')
svg += ['<text x="60" y="852" fill="#52687A" font-family="Inter,Arial,sans-serif" font-size="14">Quadro de comparação — textos tipográficos editáveis; não são telas finais nem logotipos de terceiros.</text>','</svg>']
(p/'directions-board.svg').write_text('\n'.join(svg)+'\n',encoding='utf-8')
print('generated', p/'directions-board.svg')
