// Uygulama ikonlarını assets/source/emblem.svg dosyasından üretir: node scripts/generate-icons.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';

// Önce amblemi üretin: node scripts/build-emblem.mjs
const strip = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const inner = strip(readFileSync(new URL('../assets/source/emblem.svg', import.meta.url), 'utf8'));
const innerMono = strip(readFileSync(new URL('../assets/source/emblem-mono.svg', import.meta.url), 'utf8'));
const BG = '#121D19';

/** Amblemi verilen kenar boşluğuyla kare bir tuvale yerleştirir. */
function compose({ size, scale, background, mono = false, glow = false }) {
  const s = 100 * scale;
  const off = (100 - s) / 2;
  const body = mono ? innerMono : inner;
  const bg = background
    ? `<rect width="100" height="100" fill="${background}"/>` +
      (glow
        ? `<defs><radialGradient id="g" cx="0.45" cy="0.45" r="0.6"><stop offset="0" stop-color="#3A3418"/><stop offset="1" stop-color="${background}"/></radialGradient></defs><rect width="100" height="100" fill="url(#g)"/>`
        : '')
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}">${bg}<g transform="translate(${off} ${off}) scale(${scale})">${body}</g></svg>`;
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

const out = (name, buf) => writeFileSync(new URL(`../assets/images/${name}`, import.meta.url), buf);

out('icon.png', compose({ size: 1024, scale: 0.78, background: BG, glow: true }));
// Uyarlanabilir ikon: ön plan güvenli alanın (merkezdeki %66) içinde kalmalı.
out('android-icon-foreground.png', compose({ size: 1024, scale: 0.58 }));
out('android-icon-background.png', compose({ size: 1024, scale: 0, background: BG, glow: true }));
out('android-icon-monochrome.png', compose({ size: 1024, scale: 0.58, mono: true }));
out('splash-icon.png', compose({ size: 512, scale: 0.95 }));
out('favicon.png', compose({ size: 96, scale: 0.9, background: BG }));
console.log('İkonlar üretildi.');
