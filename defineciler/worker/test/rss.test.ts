import { describe, expect, it } from 'vitest';

import { decodeEntities, mergeItems, parseFeed } from '../src/rss';

const GOOGLE = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel>
<item><title>Efes&#39;te yeni bir mozaik bulundu - Hürriyet</title>
<link>https://news.google.com/rss/articles/abc?oc=5</link>
<pubDate>Wed, 01 Oct 2026 08:00:00 GMT</pubDate>
<description>&lt;a href="https://x"&gt;Efes'te yeni bir mozaik bulundu&lt;/a&gt;&amp;nbsp;&amp;nbsp;&lt;font color="#6f6f6f"&gt;Hürriyet&lt;/font&gt;</description>
<source url="https://www.hurriyet.com.tr">Hürriyet</source></item>
<item><title>Göbekli Tepe kazıları sürüyor - AA</title><link>https://news.google.com/rss/articles/def</link>
<pubDate>Thu, 02 Oct 2026 08:00:00 GMT</pubDate><source url="https://aa.com.tr">AA</source></item>
</channel></rss>`;

const WORDPRESS = `<rss><channel><item>
<title><![CDATA[Hattuşa’da 3.500 yıllık tablet keşfedildi]]></title>
<link>https://arkeofili.com/hattusa-tablet/</link>
<pubDate>Fri, 03 Oct 2026 10:00:00 +0000</pubDate>
<description><![CDATA[<p>Boğazkale’deki kazılarda çivi yazılı bir tablet bulundu.</p>]]></description>
<content:encoded><![CDATA[<p><img src="https://arkeofili.com/img/tablet.jpg" /> Metin</p>]]></content:encoded>
</item></channel></rss>`;

describe('parseFeed', () => {
  it('Google Haberler başlığından kaynağı ayırır', () => {
    const items = parseFeed(GOOGLE, 'Google Haberler');
    expect(items).toHaveLength(2);
    expect(items[0].title).toBe("Efes'te yeni bir mozaik bulundu");
    expect(items[0].source).toBe('Hürriyet');
    expect(items[0].publishedAt).toBe('2026-10-01T08:00:00.000Z');
    expect(items[0].summary).toBe('');
  });

  it('WordPress beslemesinden görsel ve özeti çıkarır', () => {
    const [item] = parseFeed(WORDPRESS, 'Arkeofili');
    expect(item.title).toBe('Hattuşa’da 3.500 yıllık tablet keşfedildi');
    expect(item.source).toBe('Arkeofili');
    expect(item.image).toBe('https://arkeofili.com/img/tablet.jpg');
    expect(item.summary).toBe('Boğazkale’deki kazılarda çivi yazılı bir tablet bulundu.');
  });

  it('bozuk kayıtları atlar', () => {
    expect(parseFeed('<rss><item><title>x</title></item></rss>', 'X')).toEqual([]);
  });
});

describe('mergeItems', () => {
  it('aynı haberi tekilleştirir, resimliyi tercih eder ve tarihe göre sıralar', () => {
    const a = parseFeed(GOOGLE, 'Google Haberler');
    const b = parseFeed(WORDPRESS, 'Arkeofili');
    const dup = { ...a[1], image: 'https://img/x.jpg', source: 'Başka' };
    const merged = mergeItems([a, b, [dup]]);
    expect(merged).toHaveLength(3);
    expect(merged[0].source).toBe('Arkeofili');
    expect(merged.find((i) => i.title.startsWith('Göbekli'))?.image).toBe('https://img/x.jpg');
  });

  it('farklı başlıklarla verilen aynı olayı birleştirir, farklı olayları ayırır', () => {
    const base = { link: 'https://x', summary: '', image: null, publishedAt: '2026-10-08T10:00:00Z' };
    const merged = mergeItems([
      [
        { ...base, title: 'Anamur’da tarihi eser kaçakçılığı operasyonu', source: 'A' },
        { ...base, title: "Mersin Anamur'da tarihi eser satmak isteyen şüpheli yakalandı, 6 obje ele geçirildi", source: 'B' },
        { ...base, title: 'Anamur’da tarihi eser operasyonu: 6 obje ele geçirildi', source: 'C' },
        { ...base, title: "İzmir'de tarihi eser operasyonu: 3 obje ele geçirildi", source: 'D' },
      ],
    ]);
    expect(merged).toHaveLength(2);
    expect(merged.find((i) => i.source !== 'D')?.alsoIn).toHaveLength(2);
  });
});

it('decodeEntities', () => {
  expect(decodeEntities('&amp;&#252;&#x15F;&quot;')).toBe('&üş"');
});
