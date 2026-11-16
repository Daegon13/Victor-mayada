#!/usr/bin/env python3
"""Pack the static preview into a single HTML file, including CSS, JS and images."""
from pathlib import Path
import base64
root=Path(__file__).resolve().parents[1]
html=(root/'dist/index.html').read_text(encoding='utf-8')
css=(root/'dist/assets/styles.css').read_text(encoding='utf-8')
js=(root/'dist/assets/main.js').read_text(encoding='utf-8')
for asset in ['hero-industrial.webp','engineering-detail.webp']:
  b64=base64.b64encode((root/'dist/assets'/asset).read_bytes()).decode('ascii')
  css=css.replace(f"url('/assets/{asset}')",f"url('data:image/webp;base64,{b64}')")
html=html.replace('<link rel="stylesheet" href="/assets/styles.css">',f'<style>\n{css}\n</style>')
html=html.replace('<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">','')
html=html.replace('<link rel="preload" href="/assets/hero-industrial.webp" as="image" type="image/webp" fetchpriority="high">','')
html=html.replace('<script src="/assets/main.js" defer></script>',f'<script>\n{js}\n</script>')
(root/'vista-previa.html').write_text(html,encoding='utf-8')
print('Self-contained offline preview:',root/'vista-previa.html')
