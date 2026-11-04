export interface BoatFootprint { id:string; width:number; height:number; above:number; below:number; artHeight:number }
export interface BoatPlacement { id:string; x:number; y:number; scale:number; lane:number }
// Stable seeds keep the organic arrangement from flickering on each animation frame.
function noise(seed:string){
  let hash=2166136261
  for(const char of seed)hash=Math.imul(hash^char.charCodeAt(0),16777619)
  hash^=hash>>>16;hash=Math.imul(hash,0x7feb352d);hash^=hash>>>15
  return (hash>>>0)/4294967296
}
/** Flow in depth bands with irregular spacing, while preserving same-lane clearance. */
export function flowRiver(boats:BoatFootprint[],width:number,height:number,riverY:number,elapsed=0):BoatPlacement[]{
  const waterTop=height*riverY/100,waterHeight=height-waterTop
  if(width<=0||waterHeight<=0)return []
  const laneCount=Math.max(1,Math.min(4,Math.floor(waterHeight/65)))
  const result:BoatPlacement[]=[]
  for(let lane=0;lane<laneCount;lane++){
    const members=boats.filter((_,i)=>i%laneCount===lane)
    if(!members.length)continue
    const depth=laneCount===1?1:lane/(laneCount-1)
    const shapes=members.map(boat=>{
      const localDepth=Math.max(0,Math.min(1,depth+(noise(boat.id+':depth')-.5)*.22))
      return {boat,depth:localDepth,scale:.55+localDepth*.65,weight:.3+noise(boat.id+':gap')*1.7}
    })
    const gap=Math.max(24,width*.025)
    // Each neighbour pair reserves its actual widths, then gets an unequal share of free space.
    const distances=shapes.map((item,i)=>{const next=shapes[(i+1)%shapes.length]!;return (item.boat.width*item.scale+next.boat.width*next.scale)/2+gap+noise(item.boat.id+':space')*gap*2.5})
    const reserved=distances.reduce((a,b)=>a+b,0)
    const maxWidth=Math.max(...shapes.map(item=>item.boat.width*item.scale)),margin=maxWidth/2+gap
    const circumference=Math.max(width+margin*2,reserved)
    const totalWeight=shapes.reduce((sum,item)=>sum+item.weight,0)
    const speed=width*(.025+depth*.02),phase=noise(`lane:${lane}`)*circumference
    let offset=0
    shapes.forEach((item,index)=>{
      const {boat,scale}=item
      const distance=((offset+phase+elapsed*speed)%circumference+circumference)%circumference
      const anchor=waterTop+waterHeight*(.24+item.depth*.7)
      const bottom=Math.min(height-boat.below*scale-12,Math.max(waterTop+boat.artHeight*scale*.55,anchor))
      result.push({id:boat.id,lane,x:distance-margin,y:bottom-boat.artHeight*scale,scale})
      offset+=distances[index]!+(circumference-reserved)*item.weight/totalWeight
    })
  }
  return result
}
