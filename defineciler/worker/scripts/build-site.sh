#!/usr/bin/env bash
# Tanıtım sitesini (ana sayfa, gizlilik, abonelik, işaret sayfaları, sitemap) Worker'a gömer.
# Kaynaklar: depo kökündeki index.html / privacy.html / abonelik.html ve site/ görselleri.
# Kullanım (depo kökünden): bash defineciler/worker/scripts/build-site.sh
set -euo pipefail
cd "$(dirname "$0")/../../.."
python3 defineciler/worker/scripts/gen-thumbs.py
python3 defineciler/worker/scripts/gen-pages.py
node --experimental-strip-types --no-warnings defineciler/worker/scripts/gen-seo.mjs
