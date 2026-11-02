import { expect, test } from 'bun:test'
import { createDefaultScene, resolveSceneLayout, sceneObjectIds, sceneObjects } from '../shared/scene-layout'
import manifest from '../public/scene/ayutthaya-v1/manifest.json'

test('scene defaults and merged saved layouts do not share mutable objects',()=>{
  const first=createDefaultScene(),second=createDefaultScene()
  first.elements.moon.x=12
  expect(second.elements.moon.x).not.toBe(12)
  const saved={elements:{moon:{x:19}}}
  const upgraded=resolveSceneLayout(saved)
  expect(upgraded.elements.moon.x).toBe(19)
  expect(upgraded.elements.chedis).toEqual(second.elements.chedis)
  upgraded.elements.moon.x=40
  expect(saved.elements.moon.x).toBe(19)
  expect(resolveSceneLayout()).toEqual(second)
  expect(Object.keys(upgraded.elements).sort()).toEqual([...sceneObjectIds].sort())
})

test('old stored scene coordinates are constrained and non-finite values use defaults',()=>{
  const scene=resolveSceneLayout({riverY:100,elements:{moon:{x:Infinity,y:-100,width:0,opacity:4,rotation:500,z:25}}})
  expect(scene.riverY).toBe(75)
  expect(scene.elements.moon).toMatchObject({x:createDefaultScene().elements.moon.x,y:-50,width:2,opacity:1,rotation:180,z:20})
})

test('editor hitboxes preserve the immutable asset aspect ratios',()=>{
  for(const asset of manifest){expect(sceneObjects[asset.name as 'moon'|'prang'|'chedis'].aspect).toBeCloseTo(asset.width/asset.height,6)}
})
