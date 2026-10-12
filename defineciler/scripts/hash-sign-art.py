"""assets/signs içindeki görselleri içerik özetli adlarla yeniden adlandırır ve src/data/sign-art.ts dosyasını üretir.

Neden: Android'de paketlenen görseller dosya adıyla önbelleğe alınır; ad değişmezse güncellemeden sonra
eski görsel görünmeye devam eder. Kullanım (defineciler klasöründe): python3 scripts/hash-sign-art.py
Yeni görseli assets/signs/<işaret-id>.jpg olarak kopyalayın (eski özetli dosyayı silin) ve betiği çalıştırın.
"""

import hashlib
import os
import re

d = 'assets/signs'
entries = []
for f in sorted(os.listdir(d)):
    sid = re.sub(r'(-[0-9a-f]{8})?\.jpg$', '', f)
    h = hashlib.sha1(open(f'{d}/{f}', 'rb').read()).hexdigest()[:8]
    new = f'{sid}-{h}.jpg'
    if new != f:
        os.rename(f'{d}/{f}', f'{d}/{new}')
    entries.append((sid, new))


def key(s):
    return s if re.match(r'^[a-z]+$', s) else f"'{s}'"


body = ''.join(f"  {key(s)}: require('../../assets/signs/{n}'),\n" for s, n in entries)
with open('src/data/sign-art.ts', 'w') as out:
    out.write(
        '// İşaretlerin görselleri (uygulama sahibinin hazırladığı, 35 işaretin tamamı).\n'
        '// Dosya adlarındaki ek, içeriğin özetidir: görsel değişince ad da değişir, böylece cihazdaki\n'
        '// görsel önbelleği eski resmi göstermez. Yeni görsel eklerken: scripts/hash-sign-art.py\n'
        'export const SIGN_ART: Record<string, number> = {\n' + body + '};\n'
    )
print(len(entries), 'görsel')
