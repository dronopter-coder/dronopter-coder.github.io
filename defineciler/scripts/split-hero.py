# Ana sayfa görselini animasyon katmanlarına ayırır (bir kerelik):
#   python3 scripts/split-hero.py  (opencv-python-headless ve numpy gerekir)
# Girdi:  assets/images/home-hero.jpg (1024×1024)
# Çıktı:  assets/images/home-hero-bg.jpg   — mühür ve "ESER / 314" yazısı silinmiş arka plan
#         assets/images/home-hero-seal.png — saydam zeminli silindir mühür
#         src/components/hero-layout.ts    — mühür ve kapı konumları (görsel genişliğine oranla)
import json
import math
import os

import cv2
import numpy as np

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = cv2.imread(os.path.join(ROOT, 'assets/images/home-hero.jpg'))
H, W = src.shape[:2]


def ellipse_pts(cx, cy, a, b, angle_deg, n=90):
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    ang = math.radians(angle_deg)
    x = cx + a * np.cos(t) * math.cos(ang) - b * np.sin(t) * math.sin(ang)
    y = cy + a * np.cos(t) * math.sin(ang) + b * np.sin(t) * math.cos(ang)
    return np.stack([x, y], 1)


# Silindir: iki uç elipsin dışbükey zarfı (eksen ~20°, uçlar eksene dik)
back = ellipse_pts(540, 543, 46, 114, 20)
front = ellipse_pts(902, 682, 64, 122, 20)
hull = cv2.convexHull(np.concatenate([back, front]).astype(np.float32)).astype(np.int32)

mask = np.zeros((H, W), np.uint8)
cv2.fillPoly(mask, [hull], 255)
mask[797:, 522:] = 0  # alttaki cam karta taşma
mask = cv2.dilate(mask, np.ones((7, 7), np.uint8))  # üst kenardaki parlak sırtı da al
seal_mask = cv2.GaussianBlur(mask, (5, 5), 0)

# Mühür katmanı (saydam PNG, sınır kutusuna kırpılmış)
x, y, w, h = cv2.boundingRect(mask)
pad = 4
x0, y0, x1, y1 = max(0, x - pad), max(0, y - pad), min(W, x + w + pad), min(H, y + h + pad)
rgba = cv2.cvtColor(src, cv2.COLOR_BGR2BGRA)
rgba[:, :, 3] = seal_mask
cv2.imwrite(os.path.join(ROOT, 'assets/images/home-hero-seal.png'), rgba[y0:y1, x0:x1])

# Arka plan: mühür + "ESER / 314" yazısı içi boyanarak silinir
hole = cv2.dilate(mask, np.ones((45, 45), np.uint8))
hole[448:484, 168:352] = 255  # ESER / 314
# Normalize konvolüsyonla doldurma: deliğin kenarındaki renkler yumuşakça içeri yayılır (çizgi izi bırakmaz)
known = (hole == 0).astype(np.float32)
img = src.astype(np.float32)
filled = img.copy()
remaining = hole > 0
for sigma in (6, 12, 24, 48, 96):
    k = int(sigma * 3) | 1
    num = cv2.GaussianBlur(img * known[..., None], (k, k), sigma)
    den = cv2.GaussianBlur(known, (k, k), sigma)[..., None]
    est = num / np.maximum(den, 1e-6)
    ok = remaining & (den[..., 0] > 0.15) if sigma < 96 else remaining.copy()
    filled[ok] = est[ok]
    remaining &= ~ok
filled = cv2.GaussianBlur(filled, (0, 0), 3)
# Küçük yazı alanı tam çözünürlükte daha temiz dolar
text_hole = np.zeros((H, W), np.uint8)
text_hole[448:484, 168:352] = 255
fine = cv2.inpaint(src, text_hole, 7, cv2.INPAINT_TELEA)
filled[448:484, 168:352] = fine[448:484, 168:352].astype(np.float32)
# Hafif kumaş dokusu ekle (düz boyama göze batmasın)
rng = np.random.default_rng(3)
noise = rng.normal(0, 3.0, (H, W, 1)).astype(np.float32)
seal_hole = cv2.dilate(mask, np.ones((31, 31), np.uint8))
seal_hole[448:484, 168:352] = 0
alpha = cv2.GaussianBlur(seal_hole, (31, 31), 0).astype(np.float32) / 255
alpha[446:486, 166:354] = 1.0  # yazı alanı tamamen değişir
alpha = alpha[..., None]
out = img * (1 - alpha) + (filled + noise) * alpha
cv2.imwrite(os.path.join(ROOT, 'assets/images/home-hero-bg.jpg'), np.clip(out, 0, 255).astype(np.uint8),
            [cv2.IMWRITE_JPEG_QUALITY, 86])

layout = {
    'seal': {'left': x0 / W, 'top': y0 / H, 'width': (x1 - x0) / W, 'height': (y1 - y0) / H},
    # Kil tabletin ortası (boyut kapısının açılacağı yer)
    'portal': {'x': 330 / W, 'y': 820 / H},
    # "ESER / 2141" etiketinin yeri (eski yazının yerine)
    'label': {'left': 172 / W, 'top': 452 / H},
}
r = lambda d: {k: round(v, 4) for k, v in d.items()}
with open(os.path.join(ROOT, 'src/components/hero-layout.ts'), 'w') as f:
    f.write('// Otomatik üretildi: python3 scripts/split-hero.py — elle düzenlemeyin.\n')
    f.write('/** Ana sayfa görselindeki katmanların konumları (görsel genişliğine oranla). */\n')
    f.write('export const HERO_LAYOUT = ' + json.dumps({k: r(v) for k, v in layout.items()}) + ' as const;\n')
print('seal bbox', x0, y0, x1, y1)
