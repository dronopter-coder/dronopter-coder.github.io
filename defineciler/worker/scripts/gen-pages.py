#!/usr/bin/env python3
"""Depo kökündeki site sayfalarını (index, gizlilik, abonelik) Worker'a gömer.

GitHub Pages yalnızca ana dalı yayınladığı için bu sayfalar defineciler.online üzerinden
Worker tarafından sunulur. Sayfa metinleri değişince çalıştırın:
    python3 defineciler/worker/scripts/gen-pages.py
"""
import base64, io, json, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'pages.generated.ts'
PAGES = {'/': 'index.html', '/gizlilik': 'privacy.html', '/abonelik': 'abonelik.html'}
LINKS = {'privacy.html': '/gizlilik', 'abonelik.html': '/abonelik', 'index.html': '/'}

buf = io.BytesIO()
Image.open(ROOT / 'icon.png').convert('RGBA').resize((128, 128), Image.LANCZOS).save(buf, 'PNG', optimize=True)
icon = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()

out = {}
for path, name in PAGES.items():
    html = (ROOT / name).read_text(encoding='utf-8')
    for old, new in LINKS.items():
        html = html.replace(f'href="{old}"', f'href="{new}"')
    out[path] = html.replace('"icon.png"', f'"{icon}"')

OUT.write_text(
    '// scripts/gen-pages.py tarafından üretildi; elle düzenlemeyin.\n'
    f'export const SITE_PAGES: Record<string, string> = {json.dumps(out, ensure_ascii=False, indent=2)};\n',
    encoding='utf-8',
)
print(f'{OUT.name}: {", ".join(PAGES)} ({OUT.stat().st_size // 1024} KB)')
