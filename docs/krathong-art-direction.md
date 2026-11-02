# Natural Thai krathong artwork — version 1

Replaces all six base designs and all six flower arrangements with newly generated, photographic assets. One base uses a real-material coconut-shell design; the other five use folded banana leaves. Base and flower numeric IDs (0–5) stay stable, so existing submissions continue to render. There are still 36 selectable combinations. No guest data or event settings are migrated.

## Research and visual references

- [Thailand Ministry of Culture: banana-leaf craft research](https://research.culture.go.th/index.php/research/nt/weblink/27/970/1.html) and [TCDC: folding and pleating banana leaves](https://library.tcdc.or.th/record/view/b00032078), for traditional fold vocabulary.
- [Tourism Authority of Thailand: traditional krathong materials](https://www.tatnews.org/2019/01/experience-thai-traditions-and-cultural-values-in-thailands-annual-events-and-festivals/), for banana-stalk/leaf, flower, incense and candle context.

- [MThai: six banana-leaf folding techniques](https://mthai.com/campus/85357.html), including the close-up [real banana-leaf krathong photograph](https://mthai.com/app/uploads/2020/10/loykrathong2562-5-1024x577.jpg). Used to study overlapping triangular folds, visible veins, modest fastening pins, fresh marigolds, orchids and globe amaranth. Downloaded research photos are not redistributed as application artwork.
- [St Andrews International School Bangkok: making real krathongs](https://www.nordangliaeducation.com/sta-bangkok/news/2018/11/12/key-stage-2-celebrating-loy-krathong). Visual research for the scale and arrangement of fresh flowers, incense and candle.
- [Si Ri Panya International School](https://www.siripanya.com/news): photographed natural leaf-and-flower offerings in the image research.

Direction: fresh olive/forest-green banana leaves, narrow pale fibrous banana-trunk edges, botanical flower shapes, visible leaf veins and fold shadows, slight hand-made irregularity. No metallic leaf edging, blue/purple bases, plastic shine, ornamental pearls, neon flowers or oversized candle flames.

## Saved production assets

All 12 final assets are transparent WebP files inside `public/krathongs/natural-v1/`. The public manifest records dimensions and byte counts. Generated PNG originals are retained in the ignored `.data/krathong-art/` folder on the development machine. These assets are generated originals, not extracted from third-party photographs.

| ID | Base file | Design | Flower file | Arrangement |
| --- | --- | --- | --- | --- |
| 0 | `base-0.webp` | Garuda claw / กลีบเล็บครุฑ | `flower-0.webp` | Pale pink lotus and jasmine |
| 1 | `base-1.webp` | Coconut shell / กะลามะพร้าว | `flower-1.webp` | Creamy-white jasmine buds |
| 2 | `base-2.webp` | Rose folds / กลีบกุหลาบ | `flower-2.webp` | Natural golden marigolds |
| 3 | `base-3.webp` | Axe-tip folds / กลีบหัวขวาน | `flower-3.webp` | Purple dendrobium orchids |
| 4 | `base-4.webp` | Water lotus folds / บัวสายใบตอง | `flower-4.webp` | Magenta globe amaranth |
| 5 | `base-5.webp` | Fan folds / กลีบพัด | `flower-5.webp` | Marigold, jasmine, amaranth and lotus buds |

## Generation mode and prompt set

Generated using the **built-in imagegen tool**, with genuine transparent output. The later base variants use the first generated base as a material, perspective and lighting reference. No fallback CLI or external API key was used.

Common base prompt: one real hand-made Thai banana-leaf krathong base only, open empty circular center, thin banana-trunk slice wrapped in fresh folded leaves, fine parallel veins, tiny bamboo pins and hand-made irregularity. Photographic material and restrained natural greens, soft upper-left daylight, centered front-facing camera approximately 32 degrees above the horizon. Isolated transparent alpha, complete silhouette, no flowers, incense, candle, tabletop, background, glow, text, beads or metallic trim. Preserve camera, framing, scale and lighting between variants.

Base-specific prompts:

1. Sixteen tightly folded pointed garuda-claw petals in two overlapping rows.
2. Final revision: a broad low natural brown coconut-shell bowl, visible fine fibers and pale raw rim, empty center lined with one flat banana leaf and only a narrow green collar; no tall leaf petals. The first phaka variant was discarded because its silhouette was too similar to the garuda-claw base.
3. Dense low three-tier rosette border made of dozens of small curled banana-leaf rose cups.
4. Low double-row staggered diamond/axe-tip chevrons, alternating vein direction.
5. Eight broad outward-spreading lotus points with a smaller second inner tier.
6. Twelve fan-shaped sections with four accordion pleats each, arranged in two tiers.

Common flower prompt: a single compact, low oval floral insert only; front-facing camera about 35 degrees above the horizon, consistent soft upper-left light, botanical photographic detail, natural petal textures and small imperfections. Roughly 20 cm wide and 5 cm high. Genuine transparent alpha with no basket, base, wrap, visible stems, candle, incense, flag, background, external shadow, labels or text. No illustration, plastic surfaces or neon colors.

Flower-specific prompts:

1. Three pale pink partly-open Thai lotus flowers, one small bud, sparse ivory jasmine collar.
2. A low dense circular bed of individually visible ivory jasmine buds and tiny open blossoms.
3. Seven golden-yellow/orange marigold heads with irregular crinkled petals and a little jasmine.
4. Seven purple-magenta dendrobium orchids, light throats, true asymmetrical lips and jasmine accents.
5. Fifteen small plum-magenta globe amaranth heads with finely scaled papery texture and a little jasmine.
6. Four marigolds, five amaranths, jasmine clusters and two pale lotus buds.

## Integration

`KrathongArt.vue` layers the leaf photograph, slender beeswax candle and incense, flower photograph, and the same base's foreground folds. `shared/krathong-layout.ts` defines a separate flower seat and traced front-rim path for each base. Flowers retain their original aspect ratio and fit within that seat; a luminance mask hides them behind the photographed front rim, including its curved lip and individual leaf folds. The country flag remains a separate layer, with its pole also behind the front rim. SVG IDs come from Vue `useId()` so repeated boats have independent clipping/gradient references and stable server/client markup.

The original shared flower size and horizontal foreground cutoff allowed the coconut/amaranth arrangement to overlap the front lip. A later shared contact height per base left some bouquets looking suspended above the leaf floor. `arrangementSeats` now records an individual width and contact height for each of the 36 pairs. Lower petals nest behind the front folds, a broader soft contact shadow meets the leaf floor, and candle/incense/flag stems extend to the corresponding seat rather than ending in midair. The calibrated layout was checked at enlarged size for all 36 base/flower pairs, six arrangements per base. Keep the paths paired with these immutable image dimensions; changing an asset's crop requires recalibration.

The base picker uses a tighter viewBox for legible fold details. English and Thai names/descriptions match the new designs. The live river, guest preview, flower picker, admin preview, moderation list and printable QR card all use the same component.

To prepare originals again:

```sh
node scripts/prepare-krathong-art.mjs .data/krathong-art
```

Preparation only trims transparent canvas padding, resizes with the original aspect ratio, preserves alpha and compresses WebP. It does not repaint materials or change the artwork's colors.
