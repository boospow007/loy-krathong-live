import { expect,test } from 'bun:test'
import { flowRiver,type BoatFootprint } from '../shared/river-layout'
const boats:BoatFootprint[]=Array.from({length:100},(_,i)=>({id:String(i),width:130+(i*37)%220,artHeight:120,above:i%3?0:120,below:i%4?0:45,height:285}))
test('same-lane boats keep horizontal clearance at every depth and during wraparound',()=>{
  for(const [width,height] of [[390,844],[852,480],[1920,1080],[3840,1080]])for(const riverY of [30,54,75])for(const time of [0,1,17,53,180,999]){
    const slots=flowRiver(boats,width,height,riverY,time)
    expect(slots.length).toBe(boats.length)
    for(let lane=0;lane<4;lane++){
      const row=slots.filter(b=>b.lane===lane).sort((a,b)=>a.x-b.x)
      for(let i=1;i<row.length;i++){
        const a=row[i-1]!,b=row[i]!,aw=boats.find(v=>v.id===a.id)!.width*a.scale,bw=boats.find(v=>v.id===b.id)!.width*b.scale
        expect(b.x-bw/2-(a.x+aw/2)).toBeGreaterThanOrEqual(23.99)
      }
    }
  }
})
test('foreground boats are larger, lower and faster; movement is continuous',()=>{
  const uniform=boats.slice(0,12).map(b=>({...b,width:190,artHeight:156,below:20}))
  const before=flowRiver(uniform,1920,1080,54,1),after=flowRiver(uniform,1920,1080,54,2)
  for(let lane=1;lane<4;lane++){
    const near=before.find(b=>b.lane===lane)!,far=before.find(b=>b.lane===lane-1)!
    expect(near.scale).toBeGreaterThan(far.scale)
    expect(near.y+156*near.scale).toBeGreaterThan(far.y+156*far.scale)
    const nearTravel=after.find(b=>b.id===near.id)!.x-near.x,farTravel=after.find(b=>b.id===far.id)!.x-far.x
    expect(nearTravel).toBeGreaterThan(farTravel)
    expect(farTravel).toBeGreaterThan(0)
  }
})
test('every queued boat eventually crosses the viewport without batch replacement',()=>{
  const seen=new Set<string>()
  for(let time=0;time<2000;time+=2)for(const boat of flowRiver(boats,852,480,54,time))if(boat.x>=0&&boat.x<=852)seen.add(boat.id)
  expect(seen.size).toBe(boats.length)
})

test('boats form a stable irregular arrangement rather than equally spaced rows',()=>{
  const uniform=boats.slice(0,24).map(b=>({...b,width:190,artHeight:156,below:20}))
  const slots=flowRiver(uniform,1920,1080,54,0)
  expect(flowRiver(uniform,1920,1080,54,0)).toEqual(slots)
  for(let lane=0;lane<4;lane++){
    const row=slots.filter(b=>b.lane===lane).sort((a,b)=>a.x-b.x)
    const gaps=row.slice(1).map((b,i)=>b.x-row[i]!.x)
    const bottoms=row.map(b=>b.y+156*b.scale)
    expect(Math.max(...gaps)-Math.min(...gaps)).toBeGreaterThan(20)
    expect(Math.max(...bottoms)-Math.min(...bottoms)).toBeGreaterThan(5)
  }
})
