export interface BoatFootprint { id:string; width:number; height:number; above:number; below:number; artHeight:number }
export interface BoatPlacement { id:string; x:number; y:number; scale:number; lane:number }
/** Continuous circular lanes: only neighbours in the same lane reserve horizontal space. */
export function flowRiver(boats:BoatFootprint[],width:number,height:number,riverY:number,elapsed=0):BoatPlacement[]{
  const waterTop=height*riverY/100,waterHeight=height-waterTop
  if(width<=0||waterHeight<=0)return []
  const laneCount=Math.max(1,Math.min(4,Math.floor(waterHeight/65)))
  const result:BoatPlacement[]=[]
  for(let lane=0;lane<laneCount;lane++){
    const members=boats.filter((_,i)=>i%laneCount===lane)
    if(!members.length)continue
    const depth=laneCount===1?1:lane/(laneCount-1),scale=.55+depth*.65
    const maxWidth=Math.max(...members.map(b=>b.width))*scale
    const maxBelow=Math.max(...members.map(b=>b.below))*scale
    const maxArt=Math.max(...members.map(b=>b.artHeight))*scale
    const gap=Math.max(24,width*.025),spacing=maxWidth+gap
    // The loop grows with the queue, so crowded lanes wait upstream instead of colliding.
    const margin=maxWidth/2+gap,circumference=Math.max(width+margin*2,members.length*spacing)
    const pitch=circumference/members.length,speed=width*(.025+depth*.02)
    const anchor=waterTop+waterHeight*(.24+depth*.7)
    const bottom=Math.min(height-maxBelow-12,Math.max(waterTop+maxArt*.55,anchor))
    members.forEach((boat,index)=>{
      const distance=(((index+lane*.23)*pitch+elapsed*speed)%circumference+circumference)%circumference
      result.push({id:boat.id,lane,x:distance-margin,y:bottom-boat.artHeight*scale,scale})
    })
  }
  return result
}
