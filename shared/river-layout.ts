export interface BoatFootprint { id:string; width:number; height:number; above:number; below:number; artHeight:number }
export interface BoatPlacement { id:string; x:number; y:number; scale:number }
/** Pack complete presentation rectangles, including labels and movement clearance. */
export function packRiver(boats:BoatFootprint[],width:number,height:number,riverY:number,start=0):BoatPlacement[]{
  const padding=12,gap=16,left=padding,top=height*riverY/100+padding
  const availableWidth=Math.max(0,width-padding*2),availableHeight=Math.max(0,height-top-padding)
  if(availableWidth<30||availableHeight<30)return []
  const free=[{x:left,y:top,w:availableWidth,h:availableHeight}],placed:BoatPlacement[]=[]
  for(let i=0;i<boats.length;i++){
    const boat=boats[(i+start)%boats.length]!
    const scale=Math.min(1,(availableWidth-gap)/boat.width,(availableHeight-gap)/boat.height)
    if(!Number.isFinite(scale)||scale<=0)continue
    const w=boat.width*scale+gap,h=boat.height*scale+gap
    const index=free.findIndex(rect=>rect.w>=w&&rect.h>=h)
    if(index<0)break
    const rect=free.splice(index,1)[0]!
    placed.push({id:boat.id,x:rect.x+w/2,y:rect.y+gap/2+boat.above*scale,scale})
    // Disjoint free rectangles prevent later boats occupying the same region.
    if(rect.w-w>1)free.push({x:rect.x+w,y:rect.y,w:rect.w-w,h})
    if(rect.h-h>1)free.push({x:rect.x,y:rect.y+h,w:rect.w,h:rect.h-h})
    free.sort((a,b)=>a.y-b.y||a.x-b.x)
  }
  return placed
}
