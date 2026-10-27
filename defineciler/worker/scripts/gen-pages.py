#!/usr/bin/env python3
"""Depo kökündeki site sayfalarını (index, gizlilik, abonelik) ve `site/` görsellerini Worker'a gömer.

GitHub Pages yalnızca ana dalı yayınladığı için bu sayfalar defineciler.online üzerinden
Worker tarafından sunulur. Sayfa metinleri değişince çalıştırın:
    python3 defineciler/worker/scripts/gen-pages.py
"""
import base64, json, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[3]
OUT = pathlib.Path(__file__).resolve().parents[1] / 'src' / 'pages.generated.ts'
PAGES = {'/': 'index.html', '/gizlilik': 'privacy.html', '/abonelik': 'abonelik.html'}
LINKS = {'privacy.html': '/gizlilik', 'abonelik.html': '/abonelik', 'index.html': '/'}

ASSET_TYPES = {'.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml'}

out = {}
for path, name in PAGES.items():
    html = (ROOT / name).read_text(encoding='utf-8')
    for old, new in LINKS.items():
        html = html.replace(f'href="{old}"', f'href="{new}"')
    out[path] = html.replace('"icon.png"', '"/site/icon.png"')

assets = {}
for f in sorted((ROOT / 'site').iterdir()):
    if f.suffix in ASSET_TYPES:
        assets[f'/site/{f.name}'] = {'type': ASSET_TYPES[f.suffix], 'data': base64.b64encode(f.read_bytes()).decode()}

OUT.write_text(
    '// scripts/gen-pages.py tarafından üretildi; elle düzenlemeyin.\n'
    f'export const SITE_PAGES: Record<string, string> = {json.dumps(out, ensure_ascii=False, indent=2)};\n'
    f'export const SITE_ASSETS: Record<string, {{ type: string; data: string }}> = {json.dumps(assets, indent=2)};\n',
    encoding='utf-8',
)
print(f'{OUT.name}: {len(out)} sayfa, {len(assets)} görsel ({OUT.stat().st_size // 1024} KB)')
