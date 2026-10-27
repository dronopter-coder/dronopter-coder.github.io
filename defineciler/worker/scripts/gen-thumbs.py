#!/usr/bin/env python3
"""Uygulamadaki işaret görsellerinden web için küçük (320x240) kapak görselleri üretir: site/s-<id>.webp."""
import pathlib, re
from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[3]
ART = (ROOT / 'defineciler' / 'src' / 'data' / 'sign-art.ts').read_text(encoding='utf-8')
n = 0
for sid, fname in re.findall(r"^\s*'?([a-z0-9-]+)'?:\s*require\('\.\./\.\./assets/signs/([^']+)'\)", ART, flags=re.M):
    im = Image.open(ROOT / 'defineciler' / 'assets' / 'signs' / fname).convert('RGB')
    ImageOps.fit(im, (320, 240), Image.LANCZOS, centering=(0.5, 0.5)).save(ROOT / 'site' / f's-{sid}.webp', 'WEBP', quality=66, method=6)
    n += 1
print(f'{n} işaret görseli üretildi')
