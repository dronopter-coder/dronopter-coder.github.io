// "Volçan Voyvoda ve Eşkıya Belgeleri" metnini uygulama verisine çevirir: node scripts/build-belgeler.mjs
// Girdi: assets/source/belgeler.txt  →  Çıktı: src/data/belgeler.generated.ts
import { readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const lines = readFileSync(new URL('assets/source/belgeler.txt', root), 'utf8').replace(/\r/g, '').split('\n');

/** Kaynak sırası korunarak bölümler (gruplar) ve içerdikleri başlık numaraları. */
const GROUPS = [
  {
    title: 'Belgenin Kaynağı ve Çete Başları',
    subtitle: 'Notların hikâyesi, 32 kişilik liste ve Volçan’ın 1828 notu',
    sections: [1, 2],
  },
  {
    title: 'Coğrafya, Pınarlar ve Ormanlar',
    subtitle: 'Kudret Kale çevresi, Ayran Pınarı, Kara Orman, Harami Dere',
    sections: [3, 4, 5, 6, 7],
  },
  {
    title: 'Kaleler ve Kayalar',
    subtitle: 'Ceneviz ve Çimenika kaleleri, Kudret Kaya, Kapı Kaya, Şahin Kaya',
    sections: [8, 9, 10, 11, 12],
  },
  {
    title: 'Değirmenler, Köprüler ve Tepeler',
    subtitle: 'Uzun Ali Değirmeni, Karahasan Köprüsü, Hora Tepe, Kara Tepe',
    sections: [13, 14, 15, 16, 17, 18],
  },
  {
    title: 'Yaylalar, Köyler ve Mağaralar',
    subtitle: 'Emin Ağa Değirmeni, Kirazlı Yayla, Çukurcambaz, Gemili Mağara',
    sections: [19, 20, 21, 22, 23, 24],
  },
  { title: 'Kıyılar ve Şehirler', subtitle: 'Bıyıklı Ali Paşa, Riva Kalesi, Soğan Adası, Bursa, İznik', sections: [25, 26, 27] },
  {
    title: 'İtiraf, Define Cinsleri ve Çelişkiler',
    subtitle: 'Volçan’ın 1845 itirafı ve kaynak metnin tutarsızlıkları',
    sections: [28, 29, 30],
  },
];

const titleCase = (s) =>
  s
    .toLocaleLowerCase('tr')
    .replace(/(^|[\s/(“"-])(\p{L})/gu, (_, p, c) => p + c.toLocaleUpperCase('tr'))
    .replace(/\b(Ve|İle|Ya Da)\b/g, (w) => w.toLocaleLowerCase('tr'));

const intro = [];
const sections = [];
let cur = null;
let para = [];

const push = (block) => (cur ? cur.blocks : intro).push(block);
const flush = () => {
  if (!para.length) return;
  const text = para.join(' ').trim();
  para = [];
  if (!text || text === 'Son.') return;
  push(text.length < 70 && text.endsWith(':') ? { t: 'label', x: text.slice(0, -1) } : { t: 'p', x: text });
};

for (let i = 2; i < lines.length; i++) {
  const line = lines[i].trim();
  if (/^=+$/.test(line)) continue;
  if (/^-{3,}$/.test(line)) continue;
  const sec = line.match(/^(\d+)\. ([A-ZÇĞİÖŞÜÂÎÛ0-9 ’'/,.()–-]+)$/);
  if (sec && /^=+$/.test(lines[i - 1]?.trim() ?? '')) {
    flush();
    cur = { n: Number(sec[1]), title: titleCase(sec[2]), blocks: [] };
    sections.push(cur);
    continue;
  }
  const sub = line.match(/^(\d+\.\d+)\. (.+)$/);
  if (sub) {
    flush();
    push({ t: 'h', x: `${sub[1]} ${sub[2]}` });
    continue;
  }
  const ol = line.match(/^(\d+)\. (.+)$/);
  if (ol) {
    flush();
    push({ t: 'ol', n: Number(ol[1]), x: ol[2] });
    continue;
  }
  if (line.startsWith('- ')) {
    flush();
    push({ t: 'ul', x: line.slice(2) });
    continue;
  }
  if (!line) {
    flush();
    continue;
  }
  if (line.startsWith('Not:') && !cur) {
    flush();
    push({ t: 'note', x: line.slice(4).trim() });
    continue;
  }
  para.push(line);
}
flush();

if (sections.length !== 30) throw new Error(`30 başlık bekleniyordu, ${sections.length} bulundu`);
const used = GROUPS.flatMap((g) => g.sections);
if (used.length !== 30 || new Set(used).size !== 30) throw new Error('Gruplar 30 başlığı tam bir kez kapsamalı');

const words = (blocks) => blocks.reduce((n, b) => n + b.x.split(/\s+/).length, 0);
const groups = GROUPS.map((g, i) => {
  const secs = g.sections.map((n) => sections.find((s) => s.n === n));
  return {
    id: String(i + 1),
    title: g.title,
    subtitle: g.subtitle,
    minutes: Math.max(1, Math.round(secs.reduce((n, s) => n + words(s.blocks), 0) / 180)),
    sections: secs,
  };
});

const out = `// Otomatik üretildi: node scripts/build-belgeler.mjs — elle düzenlemeyin.
// Kaynak: assets/source/belgeler.txt (dolaşımdaki define notlarının düzenlenmiş metni).

export type DocBlock =
  | { t: 'p' | 'label' | 'ul' | 'h' | 'note'; x: string }
  | { t: 'ol'; n: number; x: string };
export type DocSection = { n: number; title: string; blocks: DocBlock[] };
export type DocGroup = { id: string; title: string; subtitle: string; minutes: number; sections: DocSection[] };

export const DOCS_TITLE = 'Volçan Voyvoda ve Eşkıya Belgeleri';
export const DOCS_INTRO: DocBlock[] = ${JSON.stringify(intro)};
export const DOC_GROUPS: DocGroup[] = ${JSON.stringify(groups)};
`;
writeFileSync(new URL('src/data/belgeler.generated.ts', root), out);
console.log(
  `✓ ${sections.length} başlık, ${groups.length} bölüm:`,
  groups.map((g) => `${g.id}.${g.title} (${g.minutes} dk)`).join(' | '),
);
