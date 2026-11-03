import { expect,test } from 'bun:test'
import { packRiver,type BoatFootprint } from '../shared/river-layout'
test('complete boat/name/wish footprints never overlap, including drift clearance',()=>{
  for(const [width,height] of [[852,480],[1280,720],[1920,1080],[3840,1080]])for(const riverY of [30,54,75])for(const start of [0,7,33]){
    const boats:BoatFootprint[]=Array.from({length:100},(_,i)=>({id:String(i),width:90+(i*37)%330,artHeight:80+(i*17)%100,above:i%3?0:100+(i*13)%180,below:i%4?0:45,height:0})).map(b=>({...b,height:b.artHeight+b.above+b.below}))
    const slots=packRiver(boats,width,height,riverY,start)
    expect(slots.length).toBeGreaterThan(0)
    const boxes=slots.map(slot=>{const b=boats.find(b=>b.id===slot.id)!;return{x:slot.x-b.width*slot.scale/2-3,y:slot.y-b.above*slot.scale-2,w:b.width*slot.scale+6,h:b.height*slot.scale+4}})
    for(let i=0;i<boxes.length;i++){
      const a=boxes[i]!;expect(a.x).toBeGreaterThanOrEqual(0);expect(a.y).toBeGreaterThanOrEqual(height*riverY/100);expect(a.x+a.w).toBeLessThanOrEqual(width);expect(a.y+a.h).toBeLessThanOrEqual(height)
      for(let j=0;j<i;j++){const b=boxes[j]!;expect(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y).toBe(true)}
    }
  }
})
test('crowded rivers rotate priority so every queued boat gets a turn',()=>{
  const boats=Array.from({length:36},(_,i)=>({id:String(i),width:240,height:200,above:50,below:20,artHeight:130}))
  const seen=new Set<string>()
  let start=0
  for(let page=0;page<boats.length;page++){const batch=packRiver(boats,852,480,54,start);for(const boat of batch)seen.add(boat.id);start=(start+batch.length)%boats.length}
  expect(seen.size).toBe(36)
})
