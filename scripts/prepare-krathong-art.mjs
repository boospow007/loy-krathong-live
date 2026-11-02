import sharp from 'sharp'
import { mkdir, access, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const source = resolve(process.argv.slice(2).find(value=>!value.startsWith('--')) || '.data/krathong-art')
const target = resolve('public/krathongs/natural-v1')
await mkdir(target, { recursive: true })
const manifest=[]
for (const kind of ['base','flower']) for(let i=0;i<6;i++) {
  const input=resolve(source,`${kind}-${i}.png`)
  try { await access(input) } catch { if(process.argv.includes('--partial'))continue;throw new Error(`Missing ${kind}-${i}.png`) }
  const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true})
  let left=info.width,top=info.height,right=0,bottom=0
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y)}
  if(left>=right||top>=bottom)throw new Error(`Empty transparent asset ${input}`)
  left=Math.max(0,left-4);top=Math.max(0,top-4);right=Math.min(info.width-1,right+4);bottom=Math.min(info.height-1,bottom+4)
  const output=resolve(target,`${kind}-${i}.webp`)
  const meta=await sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1}).resize({width:960,height:760,fit:'inside',withoutEnlargement:true}).webp({quality:88,alphaQuality:100,effort:6}).toFile(output)
  manifest.push({kind,index:i,src:`/krathongs/natural-v1/${kind}-${i}.webp`,width:meta.width,height:meta.height,bytes:meta.size})
  console.log(`${kind}-${i}: ${meta.width}×${meta.height}, ${(meta.size/1024).toFixed(1)} KB`)
}
await writeFile(resolve(target,'manifest.json'),JSON.stringify(manifest,null,2)+'\n')
