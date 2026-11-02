export const sceneObjectIds = ['moon', 'prang', 'chedis', 'treeline', 'mist', 'reflection'] as const
export type SceneObjectId = typeof sceneObjectIds[number]
export interface SceneObject { x: number; y: number; width: number; rotation: number; opacity: number; visible: boolean; z: number }
export interface SceneLayout { riverY: number; elements: Record<SceneObjectId, SceneObject> }
export interface SavedSceneLayout { riverY?: number; elements?: Partial<Record<SceneObjectId, Partial<SceneObject>>> }

export const sceneObjects: Record<SceneObjectId, { label: string; aspect: number; anchor: 'center' | 'bottom' }> = {
  moon: { label: 'พระจันทร์', aspect: 720 / 717, anchor: 'center' },
  prang: { label: 'ปรางค์กรุงเก่า', aspect: 1600 / 690, anchor: 'bottom' },
  chedis: { label: 'เจดีย์กรุงเก่า', aspect: 1600 / 673, anchor: 'bottom' },
  treeline: { label: 'แนวต้นไม้', aspect: 10, anchor: 'bottom' },
  mist: { label: 'หมอกริมน้ำ', aspect: 9, anchor: 'center' },
  reflection: { label: 'เงาสะท้อนพระจันทร์', aspect: .72, anchor: 'center' }
}

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))
export function createDefaultScene(): SceneLayout {
  return { riverY: 54, elements: {
    moon: { x: 64, y: 21, width: 12, rotation: 0, opacity: 1, visible: true, z: 2 },
    prang: { x: 23, y: 55, width: 35, rotation: 0, opacity: 1, visible: true, z: 5 },
    chedis: { x: 80, y: 55, width: 31, rotation: 0, opacity: .9, visible: true, z: 4 },
    treeline: { x: 50, y: 56, width: 115, rotation: 0, opacity: .9, visible: true, z: 3 },
    mist: { x: 50, y: 56, width: 115, rotation: 0, opacity: .65, visible: true, z: 7 },
    reflection: { x: 64, y: 77, width: 23, rotation: 0, opacity: .9, visible: true, z: 6 }
  } }
}

/** A fresh deep merge also upgrades events saved before the scene editor existed. */
export function resolveSceneLayout(value?: SavedSceneLayout | null): SceneLayout {
  const scene = createDefaultScene()
  if (typeof value?.riverY === 'number' && Number.isFinite(value.riverY)) scene.riverY = clamp(value.riverY, 30, 75)
  for (const id of sceneObjectIds) {
    const saved = value?.elements?.[id]
    if (!saved) continue
    for (const key of ['x', 'y', 'width', 'rotation', 'opacity', 'z'] as const) {
      const n = saved[key]
      if (typeof n !== 'number' || !Number.isFinite(n)) continue
      const limits = key === 'width' ? [2, 200] : key === 'rotation' ? [-180, 180] : key === 'opacity' ? [0, 1] : key === 'z' ? [1, 20] : [-50, 150]
      scene.elements[id][key] = clamp(n, limits[0]!, limits[1]!)
    }
    if (typeof saved.visible === 'boolean') scene.elements[id].visible = saved.visible
  }
  return scene
}

export function sceneObjectStyle(id: SceneObjectId, object: SceneObject) {
  return { left: `${object.x}%`, top: `${object.y}%`, width: `${object.width}%`, aspectRatio: String(sceneObjects[id].aspect),
    transform: `translate(-50%, ${sceneObjects[id].anchor === 'bottom' ? '-100%' : '-50%'}) rotate(${object.rotation}deg)`,
    transformOrigin: sceneObjects[id].anchor === 'bottom' ? '50% 100%' : '50% 50%', zIndex: object.z, opacity: object.opacity }
}
