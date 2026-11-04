import { expect,test } from 'bun:test'
import { countries } from '../shared/countries'
import { existsSync,readFileSync } from 'node:fs'
import { resolve } from 'node:path'
test('every selectable country has a local flag asset, without relying on emoji fonts',()=>{
  expect(countries.length).toBe(14)
  for(const country of countries){
    expect(country.flagImage?.startsWith('/flags/')).toBe(true)
    const path=resolve(import.meta.dir,'../public'+country.flagImage)
    expect(existsSync(path)).toBe(true)
    if(path.endsWith('.svg')){
      const svg=readFileSync(path,'utf8')
      expect(svg).toContain('<svg')
      expect(svg).not.toMatch(/<script|<foreignObject|(?:href|src)=["']https?:/i)
    }
  }
})
