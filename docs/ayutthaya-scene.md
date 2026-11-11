# Ayutthaya night scene

Original architecture and moon assets generated with the built-in imagegen tool in transparent-background mode. Generated PNG originals are retained in ignored `.data/scene-art/`; optimized WebP assets are saved in `public/scene/ayutthaya-v1/`. All imagery is served locally. The scene is an artistic composition inspired by Ayutthaya, not a measured reconstruction.

Visual research: [UNESCO's Historic City of Ayutthaya](https://whc.unesco.org/en/list/576), [the Tourism Directory's Wat Chaiwatthanaram](https://www.thailandtourismdirectory.go.th/en/attraction/21400), and [Ayutthaya province's riverside temple description](https://go.ayutthaya.go.th/tourist-attraction/wat-chaiwatthanaram/). Research images are not redistributed.

Scene transforms are percentages of the display canvas. Architecture/tree layers anchor at their bottom center; moon, mist and reflection anchor at their center. Width preserves each asset's aspect ratio. The editor supports dragging, a corner resize handle, keyboard nudges, numeric coordinates/width/rotation, opacity, visibility, layer order, and an independent waterline. Expanded editing uses the same 16:9 canvas. Changes autosave during interaction through the existing authenticated API and SSE, and persist in MongoDB. Legacy events receive fresh default layouts; legacy setting writes preserve an existing layout.

Water ripples are drawn on a resolution-capped canvas at up to 30 fps, with perspective spacing, broken moving highlights and a separately movable moon reflection. Mist/cloud speed, water speed and pause continue to follow event controls. Hidden remembrance mode pauses the water renderer. Existing krathong numeric IDs and flower calibration are unchanged.

## Prompt set

### prang

Use case: historical-scene. Asset type: transparent background layer for a Thai Loy Krathong event projection, independently draggable. Create a cinematic photorealistic cutout of one complete Ayutthaya old-capital riverside ruin ensemble inspired by Wat Chaiwatthanaram: a tall brick Khmer-influenced Thai prang with stacked corn-cob tiers, four modest satellite prangs, a low cloister wall and a thin horizontal weathered stone riverbank terrace. Authentic reddish-brown brick, delicate worn stucco, small vegetation at the sides. Camera directly across the river, level front view, no aerial view. Wide landscape framing, entire complex and every spire fully visible with generous transparent padding. Soft warm amber architectural uplighting from below, faint cool midnight-blue rim light, restrained elegant night atmosphere. No sky, no water, no moon, no reflection, no people, no boats, no floating lanterns, no text, no borders. Actual transparent alpha background; the complete silhouette, including the flat narrow terrace base, is isolated. Avoid ornate fantasy palaces, modern Bangkok temples and generic Chinese pagodas. This is a standalone foreground architecture asset, not a full landscape.

### chedis

Use case: historical-scene. Asset type: transparent background layer for a Thai Loy Krathong event projection, independently draggable. Create a cinematic photorealistic cutout of an Ayutthaya old-capital ruin ensemble inspired by the three historic bell-shaped stupas of Wat Phra Si Sanphet: three distinct elegant Thai bell-shaped weathered brick and pale stucco chedis with ringed spires on stepped square plinths, central chedi slightly taller, low crumbling wall and narrow flat stone bank terrace, subtle vegetation framing the two sides. Camera level front view across the river; wide horizontal composition, all three spires completely visible. Authentic aged Thai masonry with restrained warm amber architectural uplighting and a cool midnight-blue ambient edge light. Graceful and solemn, rich real surface detail. Entire asset isolated on genuinely transparent alpha background with generous padding. No sky, no water, no moon, no reflection, no people, no boats, no lanterns, no text or borders. No golden fantasy palace, no modern Bangkok temple, no Chinese pagodas. Standalone architecture layer with a flat, narrow base.

### moon

Use case: photorealistic-natural. Asset type: independently movable full-moon layer for a Thai Loy Krathong night event backdrop. One scientifically plausible full moon, complete circular disc perfectly front-facing, highly detailed lunar maria and subtle craters, soft warm ivory and pale antique-gold tones, natural photographic realism, smooth spherical lighting, evenly sharp clear outline. Centered with 10 percent transparent padding around the disc. Genuinely transparent alpha background. NO sky, stars, clouds, external halo, lens flare, scenery, water, reflections, text or border. Moon only; its outer silhouette is a perfect full circle. The website adds its own subtle glow.

## Large-screen temple assets

The 2026-11-11 temple layers in `public/scene/ayutthaya-v2/` were generated with the built-in ImageGen tool in transparent-background mode, using their corresponding v1 cutouts as references. The generated PNGs were resized to 3840 × 1656 for the prang and 3840 × 1615 for the chedis, then encoded as WebP with alpha. The same files supply the water reflections.

The `-8k.webp` variants are exported directly from the same PNG masters at 7680 × 3312 and 7680 × 3230. The scene loads those files directly for both the temples and their reflections.

**Prang prompt**

Refine this existing transparent Ayutthaya temple cutout into a high-resolution photorealistic asset for a large LED display. Preserve the five Ayutthaya prang towers, especially the tall rounded central tower, the frontal camera angle, relative positions, wide framing, and warm amber uplighting. Reconstruct fine aged brick and stone detail. Keep the entire silhouette and continuous horizontal base fully in frame, tightly cropped, centered and bottom-aligned. Match the reference aspect ratio, target 3840×1656 or the largest supported resolution. Actual transparent alpha around all architecture and between towers. No sky, water, text, or new objects.

**Chedis prompt**

Refine this existing transparent Ayutthaya temple cutout into a high-resolution photorealistic asset for a large LED display. Preserve the three bell-shaped Ayutthaya chedis, pointed ringed spires, stairways and existing trees, the frontal camera angle, relative positions, wide framing, and warm amber uplighting. Reconstruct fine aged brick and stone detail. Keep the entire silhouette and continuous horizontal base fully in frame, tightly cropped, centered and bottom-aligned. Match the reference aspect ratio, target 3840×1615 or the largest supported resolution. Actual transparent alpha around all architecture and between towers. No sky, water, text, or new objects.

## Verification

- Typecheck and 15 automated tests: scene bounds, independent defaults, immutable art ratios, API validation, MongoDB reload, legacy writes, SSE delivery and existing event features.
- Browser checks on separate local admin/display tabs: pointer drag, corner resize, waterline drag, keyboard nudge, rotation, visibility, reset and persisted positions after a display reload.
- Rendered water pixels changed during playback, stayed stable while paused, and changed again on resume. Large-screen composition checked at 1920 × 1080.
- Runtime water canvas caps its backing width at 2048 pixels and device ratio at 1.5; artwork stays separate so it remains sharp on large displays.
