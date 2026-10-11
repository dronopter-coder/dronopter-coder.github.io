"""Define işaretleri için gerçekçi "taşa oyulmuş" görseller üretir.

Her işaretin piktogram maskesi (scripts/render-sign-masks.mjs) taş yüzeyine oyulur:
fraktal taş dokusu, aşınmış ve dövülerek açılmış oyuk kenarları, yönlü ışık ve
ortam gölgesi, liken lekeleri ve çatlaklar. Çıktı: assets/signs/<id>.jpg

Kullanım: python3 scripts/render-signs.py <maske_klasörü> <çıktı_klasörü> [id ...]
"""

import sys
from pathlib import Path

import numpy as np
from PIL import Image
from scipy import ndimage as ndi

# Taş türleri: (açık ton, koyu ton, oyuk içi tonu, oyuk açık mı (patina kırılmış), pürüz)
MATERIALS = {
    # Çöl cilası (patina) kaplı koyu bazalt/andezit: dövülen çizgiler açık renk görünür (kaya resimleri)
    'patina': ((0.42, 0.29, 0.20), (0.24, 0.16, 0.11), (0.70, 0.58, 0.45), True, 1.0),
    # Kireçtaşı: sıcak bej, oyuklar kirle koyulaşır
    'kirectasi': ((0.80, 0.74, 0.63), (0.62, 0.56, 0.46), (0.50, 0.45, 0.37), False, 0.8),
    # Mermer: soğuk beyaz-gri, damarlı
    'mermer': ((0.88, 0.87, 0.84), (0.70, 0.69, 0.66), (0.60, 0.59, 0.56), False, 0.45),
    # Gri andezit / bazalt blok
    'andezit': ((0.52, 0.50, 0.47), (0.34, 0.33, 0.31), (0.30, 0.29, 0.27), False, 1.1),
    # Kapadokya tüfü: açık pembe-krem, yumuşak
    'tuf': ((0.86, 0.76, 0.66), (0.72, 0.60, 0.50), (0.58, 0.48, 0.40), False, 0.7),
}

MATERIAL_OF = {
    'yilan': 'patina', 'kaplumbaga': 'andezit', 'kartal': 'kirectasi', 'aslan': 'kirectasi', 'boga': 'mermer',
    'akrep': 'patina', 'keci': 'patina', 'balik': 'mermer', 'kus': 'tuf', 'kertenkele': 'patina',
    'hac': 'andezit', 'hilal': 'mermer', 'gunes': 'kirectasi', 'yildiz': 'mermer', 'ok': 'andezit',
    'at-nali': 'andezit', 'spiral': 'patina', 'tamga': 'patina', 'tasci': 'kirectasi', 'kazan': 'kirectasi',
    'cizgi': 'patina', 'el': 'patina', 'ayak': 'kirectasi', 'yuz': 'mermer', 'insan': 'kirectasi',
    'canak': 'andezit', 'kaya-mezari': 'tuf', 'sahte-kapi': 'tuf', 'basamak': 'kirectasi', 'sarnic': 'kirectasi',
    'tumulus': 'kirectasi', 'tas-yigini': 'andezit', 'sinir-tasi': 'kirectasi', 'yazit': 'mermer', 'kenet': 'kirectasi',
}


def fbm(shape, rng, scales, falloff=0.6):
    out = np.zeros(shape)
    for s in scales:
        n = ndi.gaussian_filter(rng.standard_normal(shape), s, mode='wrap')
        out += n / (n.std() + 1e-9) * (s ** falloff)
    return out / (out.std() + 1e-9)


def cracks(shape, rng, count):
    h, w = shape
    img = np.zeros(shape)
    for _ in range(count):
        y, x = rng.uniform(0, h), rng.uniform(0, w)
        ang = rng.uniform(0, np.pi * 2)
        for _ in range(int(rng.uniform(80, 260))):
            ang += rng.normal(0, 0.25)
            y += np.sin(ang) * 2
            x += np.cos(ang) * 2
            if 0 <= y < h and 0 <= x < w:
                img[int(y), int(x)] = 1
    return ndi.gaussian_filter(img, 0.8)


def render(mask_path, out_path, material, seed):
    rng = np.random.default_rng(seed)
    light_c, dark_c, groove_c, patina, rough = MATERIALS[material]
    mask = np.asarray(Image.open(mask_path).convert('L'), dtype=float) / 255.0
    shape = mask.shape

    # Taş yüzeyi: geniş dalgalanma + orta pürüz + ince tane + çatlaklar
    broad = fbm(shape, rng, (90, 45))
    mid = fbm(shape, rng, (16, 8, 4))
    grain = fbm(shape, rng, (1.2, 0.6), falloff=0.2)
    crack = cracks(shape, rng, int(rng.integers(2, 6)))
    base = broad * 3.0 + mid * 0.9 * rough + grain * 0.25 * rough - crack * 2.5

    # Oyuk: aşınmış, düzensiz kenar ve dövme (pecking) izleri
    edge_noise = fbm(shape, rng, (5, 2.5, 1.2), falloff=0.4)
    soft = ndi.gaussian_filter(mask, 2.2) + 0.16 * edge_noise
    carve = np.clip((soft - 0.30) / 0.30, 0, 1)
    peck = 1 + 0.30 * fbm(shape, rng, (0.9, 0.5), falloff=0.1)
    # U profilli oyuk: yumuşak duvarlar, dövme izli taban
    depth = ndi.gaussian_filter(carve, 2.6) * peck
    height = base - depth * 14.0

    # Işık: sol üstten yönlü ışık + ortam gölgesi
    gy, gx = np.gradient(ndi.gaussian_filter(height, 0.6))
    k = 1.5
    nx, ny, nz = -gx * k, -gy * k, np.ones_like(gx)
    norm = np.sqrt(nx ** 2 + ny ** 2 + nz ** 2)
    L = np.array([-0.62, -0.58, 0.40])  # alçak, yandan gelen (sıyırma) ışık
    L /= np.linalg.norm(L)
    diff = np.clip((nx * L[0] + ny * L[1] + nz * L[2]) / norm, 0, 1)
    cavity = np.clip(ndi.gaussian_filter(height, 6) - height, 0, None)
    ao = np.clip(1 - 0.08 * cavity - 0.18 * ndi.gaussian_filter(depth, 3), 0.4, 1)

    # Renk: iki ton arası lekeli geçiş, oyuk içi ayrı ton, liken lekeleri
    t = np.clip(0.5 + 0.28 * fbm(shape, rng, (40, 12, 5)) + 0.08 * grain, 0, 1)[..., None]
    albedo = np.array(dark_c) * (1 - t) + np.array(light_c) * t
    if material == 'mermer':
        veins = np.abs(np.sin(fbm(shape, rng, (30, 10)) * 3 + np.linspace(0, 9, shape[1])[None, :]))
        albedo *= (0.92 + 0.08 * np.clip(veins, 0, 1))[..., None]
    g = np.clip(depth, 0, 1)[..., None] * (0.8 if patina else 0.35)
    albedo = albedo * (1 - g) + np.array(groove_c) * g
    lichen = np.clip((fbm(shape, rng, (22, 9, 3, 1.2)) - 1.55) * 1.3, 0, 1) * (1 - np.clip(depth * 2, 0, 1))
    lichen_c = np.array((0.66, 0.68, 0.58)) if rng.random() < 0.7 else np.array((0.82, 0.58, 0.24))
    albedo = albedo * (1 - lichen[..., None] * 0.55) + lichen_c * lichen[..., None] * 0.55

    color = albedo * (0.38 * ao + 1.05 * diff * ao)[..., None]

    # Fotoğraf görünümü: vinyet, hafif sıcak ton, sensör gürültüsü, gama
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w]
    r = np.sqrt(((xx - w / 2) / (w / 2)) ** 2 + ((yy - h / 2) / (h / 2)) ** 2)
    color *= np.clip(1.08 - 0.32 * r ** 2, 0, 1)[..., None]
    color *= np.array((1.04, 1.0, 0.95))
    color += rng.normal(0, 0.008, color.shape)
    color = np.clip(color, 0, 1) ** (1 / 1.08)
    Image.fromarray((color * 255).astype(np.uint8)).save(out_path, quality=80, optimize=True, progressive=True)


def main():
    masks, out = Path(sys.argv[1]), Path(sys.argv[2])
    out.mkdir(parents=True, exist_ok=True)
    ids = sys.argv[3:] or sorted(p.stem for p in masks.glob('*.png'))
    for i, sid in enumerate(ids):
        render(masks / f'{sid}.png', out / f'{sid}.jpg', MATERIAL_OF.get(sid, 'kirectasi'), seed=1000 + sum(map(ord, sid)))
        print('✓', sid)


if __name__ == '__main__':
    main()
