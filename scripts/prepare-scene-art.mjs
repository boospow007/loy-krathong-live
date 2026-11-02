import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
const target='public/scene/ayutthaya-v1'
await mkdir(target,{recursive:true})
const manifest=[]
for(const name of ['moon','prang','chedis']){
  const input=`.data/scene-art/${name}.png`
  const {data,info}=await sharp(input).ensureAlpha().raw().toBuffer({resolveWithObject:true})
  let left=info.width,top=info.height,right=0,bottom=0
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>12){left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x);bottom=Math.max(bottom,y)}
  if(left>=right||top>=bottom)throw new Error(`Empty asset: ${name}`)
  left=Math.max(0,left-3);top=Math.max(0,top-3);right=Math.min(info.width-1,right+3);bottom=Math.min(info.height-1,bottom+3)
  const result=await sharp(input).extract({left,top,width:right-left+1,height:bottom-top+1}).resize({width:name==='moon'?720:1600,withoutEnlargement:true}).webp({quality:88,alphaQuality:100,effort:6}).toFile(`${target}/${name}.webp`)
  manifest.push({name,width:result.width,height:result.height,bytes:result.size,src:`/scene/ayutthaya-v1/${name}.webp`})
}
await writeFile(`${target}/manifest.json`,JSON.stringify(manifest,null,2)+'\n')
console.log(manifest)
