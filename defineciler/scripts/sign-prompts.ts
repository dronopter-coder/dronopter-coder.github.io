// Define işaretleri için görsel üretim tarifleri (.github/scripts/gen-sign-images.mjs kullanır).
// Hepsi aynı fotoğraf diline sahip: arazide çekilmiş, doğal gün ışığı, belgesel arkeoloji fotoğrafı.

const STYLE =
  'Realistic documentary photograph taken in the field in rural Anatolia, Turkey. Natural daylight with soft raking side light that reveals the carving depth, ' +
  'shallow depth of field, 35mm lens, weathered stone with lichen and erosion, authentic archaeological look. ' +
  'No people, no hands, no text, no letters, no watermark, no frame, no modern objects.';

const p = (subject: string) => `${subject}. ${STYLE}`;

export const PROMPTS: Record<string, string> = {
  // Hayvan figürleri
  yilan: p('An ancient snake relief carved on a weathered limestone block, the serpent body undulating across the stone, head with visible eyes, Roman-era style'),
  kaplumbaga: p('A large natural boulder on a hillside that vaguely resembles a turtle, with a shallow, crude turtle figure pecked into its top surface'),
  kartal: p('A worn Hittite-style double-headed eagle relief carved on a grey andesite rock face, wings spread, ancient and eroded'),
  aslan: p('An ancient eroded stone lion sculpture guarding a tomb, Phrygian or Hellenistic style, lying on a grassy slope'),
  boga: p('A Roman marble altar fragment with a carved bucranium (bull skull) relief decorated with garlands, eroded marble'),
  akrep: p('A prehistoric scorpion figure pecked into a dark desert-varnished basalt rock, petroglyph style'),
  keci: p('Prehistoric petroglyphs of ibex (wild goats) with large curved horns pecked into dark varnished basalt rock in the highlands of eastern Anatolia'),
  balik: p('An early Christian fish symbol (ichthys) carved on an old marble grave stone, eroded and partly covered with lichen'),
  kus: p('A dove relief carved on a Byzantine stone slab inside a rock-cut chapel in Cappadocia, soft tuff stone'),
  kertenkele: p('A lizard figure carved in low relief on an ancient Roman stone block, worn by weather'),
  // Semboller ve oymalar
  hac: p('A medieval Armenian khachkar style cross carved on a weathered stone slab standing in an old graveyard'),
  hilal: p('A crescent moon motif carved in relief on an old Ottoman marble gravestone, eroded'),
  gunes: p('A rosette (sun wheel) motif carved in relief on an ancient Phrygian or Roman funerary stone, eroded limestone'),
  yildiz: p('A six-pointed star (Seal of Solomon) motif carved in relief on the stone wall of a Seljuk caravanserai'),
  ok: p('An arrow sign carved into a rock on a hilltop, a surveying mark chiselled into the stone, with a small drilled hole'),
  'at-nali': p('A horseshoe-shaped U groove carved into a large rock beside an old village path'),
  spiral: p('A prehistoric spiral motif pecked into a flat rock surface, weathered, with lichen'),
  tamga: p('Old Turkic tamga (tribal brand) symbols scratched on a rock face in a highland pasture'),
  tasci: p("A stonemason's mark carved on a cut ashlar block in the wall of a Seljuk caravanserai, close-up"),
  kazan: p('An ancient rock-cut wine press with a round basin and a channel carved into bedrock in an olive grove'),
  cizgi: p('Rows of short parallel notches and small dots scratched into a rock near a shepherd path'),
  // İnsan, el ve ayak
  el: p('An open human hand outline carved into a weathered rock face, ancient and eroded'),
  ayak: p('A pair of human footprints carved into a stone slab at the entrance of an ancient sanctuary, votive footprints'),
  yuz: p('A Medusa head relief carved on a Roman marble sarcophagus, weathered'),
  insan: p('A Hellenistic grave stele with a carved standing human figure in relief, eroded limestone'),
  // Kaya ve yapı izleri
  canak: p('Prehistoric cupules (cup marks): several round shallow hollows carved into a flat rock surface on a hilltop'),
  'kaya-mezari': p('Lycian rock-cut tombs with temple facades carved into a cliff face'),
  'sahte-kapi': p('A Phrygian rock-cut cult facade with a carved false door niche in a tuff cliff'),
  basamak: p('Ancient rock-cut steps and a stepped altar carved into bedrock on a hill'),
  sarnic: p('An ancient stone cistern with a rock-cut water channel, partly ruined'),
  tumulus: p('A large ancient burial mound (tumulus) rising in a flat plain under an open sky'),
  'tas-yigini': p('A cairn of stacked stones on a mountain pass in a highland pasture'),
  'sinir-tasi': p('An ancient Roman milestone column with a worn inscription standing beside an old road'),
  yazit: p('An ancient Greek inscription carved on a weathered marble block, letters worn by time'),
  kenet: p('Ancient ashlar blocks with empty dovetail (butterfly) clamp sockets carved on their top surface'),
};
