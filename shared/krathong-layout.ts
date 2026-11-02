/** Calibrated against the immutable natural-v1 photographs.
 * Rim paths use source pixels; arrangement placements use the 280 × 230 SVG coordinates.
 * Flowers may rise above the back rim, but must remain behind the front rim.
 */
export const baseSeats = [
  { height: 614, width: 128, depth: 76,
    front: 'M0 282 L44 231 Q83 265 105 316 L146 292 Q181 307 216 365 L274 328 Q334 349 384 390 L470 335 Q521 351 571 402 L658 330 Q704 344 739 365 L817 285 Q848 269 864 315 L914 231 L960 282 V614 H0 Z' },
  { height: 601, width: 136, depth: 76,
    front: 'M0 210 L43 204 C124 282 280 334 480 334 C680 334 836 282 917 204 L960 210 V601 H0 Z' },
  { height: 586, width: 108, depth: 72,
    front: 'M0 270 L65 255 C75 221 122 217 147 240 C173 223 208 248 224 271 C249 262 280 276 291 304 C321 297 347 315 351 334 C375 318 405 322 426 343 C449 325 486 326 507 347 C529 328 566 322 589 336 C609 314 641 301 665 309 C681 277 713 259 741 267 C759 240 795 225 822 242 C849 215 889 229 900 262 L960 280 V586 H0 Z' },
  { height: 557, width: 128, depth: 76,
    front: 'M0 282 L49 219 Q86 252 131 235 L220 335 L305 284 L393 361 L483 313 L571 361 L664 289 L746 330 L835 230 Q884 254 911 218 L960 280 V557 H0 Z' },
  { height: 580, width: 96, depth: 70,
    front: 'M0 385 L172 181 Q232 224 293 376 Q367 408 480 363 Q564 405 651 415 Q690 339 744 284 Q792 311 827 383 L960 430 V580 H0 Z' },
  { height: 589, width: 118, depth: 74,
    front: 'M0 290 L58 262 Q99 235 144 267 Q201 291 234 368 Q258 331 283 322 Q338 329 390 399 Q437 352 480 331 Q533 343 580 400 Q632 343 677 321 Q715 335 743 367 Q788 292 818 265 Q868 236 915 264 L960 290 V589 H0 Z' }
] as const
export const flowerSizes = [
  { width: 960, height: 566 }, { width: 960, height: 443 },
  { width: 960, height: 587 }, { width: 960, height: 515 },
  { width: 960, height: 451 }, { width: 960, height: 500 }
] as const

// Each base × flower pair has its own footprint and contact height.
// Column order: lotus, jasmine, marigold, orchid, amaranth, mixed bouquet.
// The lower petals tuck behind the rim instead of sitting on its back edge.
export const arrangementSeats = [
  // Garuda claw folds
  [{ width: 126, bottom: 179 }, { width: 128, bottom: 177 }, { width: 124, bottom: 180 }, { width: 126, bottom: 180 }, { width: 126, bottom: 178 }, { width: 128, bottom: 181 }],
  // Coconut shell
  [{ width: 128, bottom: 173 }, { width: 134, bottom: 171 }, { width: 124, bottom: 174 }, { width: 130, bottom: 174 }, { width: 132, bottom: 172 }, { width: 130, bottom: 175 }],
  // Rose folds
  [{ width: 108, bottom: 176 }, { width: 108, bottom: 174 }, { width: 106, bottom: 177 }, { width: 108, bottom: 177 }, { width: 108, bottom: 175 }, { width: 108, bottom: 178 }],
  // Axe-tip folds
  [{ width: 126, bottom: 181 }, { width: 128, bottom: 179 }, { width: 124, bottom: 182 }, { width: 126, bottom: 182 }, { width: 128, bottom: 180 }, { width: 128, bottom: 183 }],
  // Water lotus folds
  [{ width: 94, bottom: 186 }, { width: 96, bottom: 184 }, { width: 94, bottom: 187 }, { width: 96, bottom: 187 }, { width: 96, bottom: 185 }, { width: 96, bottom: 188 }],
  // Fan folds
  [{ width: 116, bottom: 182 }, { width: 118, bottom: 180 }, { width: 114, bottom: 183 }, { width: 118, bottom: 183 }, { width: 118, bottom: 181 }, { width: 118, bottom: 184 }]
] as const

const round = (n: number) => Number(n.toFixed(4))
export function getKrathongLayout(base: number, flower: number) {
  const seat = baseSeats[base] || baseSeats[0]
  const size = flowerSizes[flower] || flowerSizes[0]
  const arrangement = arrangementSeats[base]?.[flower] || arrangementSeats[0][0]
  const baseScale = 125 / seat.height
  const baseWidth = 960 * baseScale
  const image = { x: round(140 - baseWidth / 2), y: 98, width: round(baseWidth), height: 125 }
  const scale = Math.min(arrangement.width / size.width, seat.depth / size.height)
  const width = round(size.width * scale), height = round(size.height * scale)
  return {
    image,
    transform: `translate(${image.x} 98) scale(${round(baseScale)})`,
    front: seat.front,
    anchorY: arrangement.bottom - 2,
    pocket: { x: 140 - seat.width / 2, width: seat.width, bottom: arrangement.bottom, height: seat.depth },
    flowers: { x: round(140 - width / 2), y: round(arrangement.bottom - height), width, height },
    contact: { y: arrangement.bottom - 3, rx: round(width * .4), ry: round(width * .043) }
  }
}
