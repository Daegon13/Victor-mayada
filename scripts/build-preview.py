#!/usr/bin/env python3
"""Generate a dependency-free static review build from the same Astro HTML template.
Astro remains the canonical production build; this renderer exists for offline review.
"""
from pathlib import Path
from datetime import datetime
from html import escape
from urllib.parse import quote
from shutil import copytree
import json, re
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
DIST=ROOT/'dist'
DIST.mkdir(exist_ok=True)
config=json.loads((PUBLIC/'site-config.json').read_text(encoding='utf-8'))
html=(ROOT/'src/templates/index.html').read_text(encoding='utf-8')
site=config['siteUrl'].strip().rstrip('/')
phone=re.sub(r'\D','',config['whatsapp'])
ready= bool(site and config['serviceArea'].strip() and 8<=len(phone)<=15)
has_contact=8<=len(phone)<=15
schema={
  '@context':'https://schema.org','@type':'Person','name':config['personName'],
  'description':'Técnico independiente con 40 años de experiencia en reparación de ómnibus convencionales, eléctricos e híbridos.',
  'knowsAbout':['Reparación de ómnibus','Ómnibus eléctricos','Ómnibus híbridos'],
  'areaServed':{'@type':'Country','name':'Uruguay'}
}
if site: schema['url']=site
if has_contact: schema['telephone']='+'+phone
if config.get('email'): schema['email']=config['email']
initial_message='Hola, Víctor. Me comunico por tus servicios de reparación de ómnibus. Quisiera consultar por un vehículo y explicarte el problema.'
initial_link='https://wa.me/'+phone+'?text='+quote(initial_message) if has_contact else '#contacto'
cta=('href="'+escape(initial_link,quote=True)+'" target="_blank" rel="noopener noreferrer"' if has_contact else 'href="#contacto" data-contact-unavailable="true"')
status='' if has_contact else '<div class="setup-notice" role="status"><strong>Vista de desarrollo:</strong> falta configurar el WhatsApp y los demás datos comerciales. Los enlaces de contacto permanecerán desactivados hasta que se completen.</div>'
email=('<a href="mailto:'+escape(config['email'],quote=True)+'" class="contact-method"><span class="contact-method__icon" aria-hidden="true">@</span><span><strong>Correo electrónico</strong><small>'+escape(config['email'])+'</small></span><span aria-hidden="true">↗</span></a>') if config['email'] else ''
tel=('<a href="tel:'+escape(config['phone'].replace(' ',''),quote=True)+'" class="contact-method" data-track="phone_click"><span class="contact-method__icon" aria-hidden="true">↗</span><span><strong>Teléfono</strong><small>'+escape(config['phone'])+'</small></span><span aria-hidden="true">↗</span></a>') if config['phone'] else ''
portrait=('<img class="portrait-real" src="'+escape(config['portraitUrl'],quote=True)+'" alt="Víctor Mayada, técnico especializado en ómnibus" loading="lazy" width="520" height="600">') if config['portraitUrl'] else '<div class="portrait-placeholder"><span class="portrait-placeholder__icon" aria-hidden="true">VM<span>.</span></span><span>Espacio reservado para<br>fotografía real de Víctor</span></div>'
techs=[('convencional','Ómnibus convencionales','CONVENCIONAL'),('electrico','Ómnibus eléctricos','ELÉCTRICO'),('hibrido','Ómnibus híbridos','HÍBRIDO')]
active=[item for item in techs if item[1] in config['servicesConfirmed']]
for key,label,short in techs:
 if (key,label,short) not in active:
  html=re.sub(r'<article class="tech-card" data-service="'+key+r'">[\s\S]*?</article>','',html)
address_line='<p class="address-line">Dirección comercial: '+escape(config['address'])+'</p>' if config.get('address') else ''
variables={
 '%%OG_IMAGE_URL%%':escape(site+'/assets/hero-industrial.webp' if site else '/assets/hero-industrial.webp',quote=True),
 '%%CANONICAL%%':f'<link rel="canonical" href="{escape(site,quote=True)}/"><meta property="og:url" content="{escape(site,quote=True)}/">' if site else '',
 '%%JSONLD%%':'<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')+'</script>',
 '%%ROBOTS%%':'index,follow,max-image-preview:large' if ready else 'noindex,nofollow',
 '%%CONFIG_JSON%%':json.dumps(config,ensure_ascii=False).replace('<','\\u003c'),
 '%%STATUS%%':status,
 '%%HERO_CTA%%':cta,
 '%%EMAIL_LINK%%':email,
 '%%PHONE_LINK%%':tel,
 '%%COVERAGE%%':escape(config['serviceArea']) if config['serviceArea'] else 'Cobertura por confirmar',
 '%%PORTRAIT%%':portrait,
 '%%YEAR%%':str(datetime.now().year),
 '%%PERSON_NAME%%':escape(config['personName']),
 '%%PERSON_NAME_UPPER%%':escape(config['personName'].upper()),
 '%%TAGLINE%%':escape(config['tagline']),
 '%%TECH_COUNT%%':str(len(active)).zfill(2),
 '%%TECH_COLUMNS%%':str(max(1,len(active))),
 '%%TECH_TYPES%%':' <i aria-hidden="true">/</i> '.join(t[2] for t in active),
 '%%ADDRESS_LINE%%':address_line
}
for k,v in variables.items(): html=html.replace(k,v)
assert '%%' not in html, 'Unprocessed template variables found'
(DIST/'index.html').write_text(html,encoding='utf-8')
copytree(PUBLIC/'assets',DIST/'assets',dirs_exist_ok=True)
(DIST/'site-config.json').write_text(json.dumps(config,ensure_ascii=False,indent=2),encoding='utf-8')
(DIST/'robots.txt').write_text((f'User-agent: *\nAllow: /\nSitemap: {site}/sitemap.xml\n' if ready else 'User-agent: *\nDisallow: /\n'),encoding='utf-8')
sitemap=(f'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{escape(site)}/</loc></url></urlset>' if site else '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"/>')
(DIST/'sitemap.xml').write_text(sitemap,encoding='utf-8')
print('Static preview generated:',DIST/'index.html')
