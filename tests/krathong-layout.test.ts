import { expect, test } from 'bun:test'
import manifest from '../public/krathongs/natural-v1/manifest.json'
import { baseSeats, flowerSizes, getKrathongLayout } from '../shared/krathong-layout'

test('rim calibration matches the immutable artwork dimensions', () => {
  for (const asset of manifest) {
    const dimensions = asset.kind === 'base'
      ? { width: 960, height: baseSeats[asset.index]!.height }
      : flowerSizes[asset.index]!
    expect({ width: asset.width, height: asset.height }).toEqual(dimensions)
  }
})

test('all 36 arrangements fit their base seat without distorting the flowers', () => {
  for (let base = 0; base < 6; base++) {
    for (let flower = 0; flower < 6; flower++) {
      const { image, flowers, pocket } = getKrathongLayout(base, flower)
      const source = flowerSizes[flower]!
      expect(flowers.x).toBeGreaterThanOrEqual(pocket.x - 0.001)
      expect(flowers.x + flowers.width).toBeLessThanOrEqual(pocket.x + pocket.width + 0.001)
      expect(flowers.y).toBeGreaterThanOrEqual(pocket.bottom - pocket.height - 0.001)
      expect(flowers.y + flowers.height).toBeCloseTo(pocket.bottom, 3)
      expect(flowers.x + flowers.width / 2).toBeCloseTo(140, 3)
      expect(flowers.width / flowers.height).toBeCloseTo(source.width / source.height, 4)
      expect(image.width / image.height).toBeCloseTo(960 / baseSeats[base]!.height, 4)
    }
  }
})
