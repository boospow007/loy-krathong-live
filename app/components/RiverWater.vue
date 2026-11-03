<script setup lang="ts">
const props=defineProps<{speed:number;paused:boolean}>()
const canvas=ref<HTMLCanvasElement>()
let observer:ResizeObserver|undefined,frame=0,last=0,painted=0,phase=0,width=0,height=0,needsPaint=true
onMounted(()=>{
  const el=canvas.value!,ctx=el.getContext('2d')
  if(!ctx)return
  const resize=()=>{const r=el.getBoundingClientRect();width=r.width;height=r.height;const ratio=Math.min(window.devicePixelRatio||1,1.5,2048/Math.max(1,width));el.width=Math.round(width*ratio);el.height=Math.round(height*ratio);ctx.setTransform(ratio,0,0,ratio,0,0);needsPaint=true}
  observer=new ResizeObserver(resize);observer.observe(el);resize()
  const paint=()=>{
    ctx.clearRect(0,0,width,height)
    if(!width||!height)return
    // Increasing spacing and amplitude toward the viewer creates perspective.
    for(let row=1;row<104;row++){
      const depth=row/104,y=Math.pow(depth,1.7)*height
      const travel=phase*(4+depth*18),amplitude=.3+depth*2.8
      const seed=Math.sin(row*127.1)*43758.5453,noise=seed-Math.floor(seed)
      ctx.beginPath()
      for(let x=-40;x<=width+40;x+=28){const yy=y+Math.sin(x*.012+row*.71+phase*.45)*amplitude+Math.sin(x*.034-row+phase*.7)*amplitude*.35;x===-40?ctx.moveTo(x,yy):ctx.lineTo(x,yy)}
      ctx.strokeStyle=row%7===0?'#c4c1a0':row%3===0?'#8cb7b9':'#4b838f'
      ctx.globalAlpha=(.045+depth*.09)*(.65+.35*Math.sin(row*13.4+phase*.24))
      ctx.lineWidth=.45+depth*.7
      ctx.setLineDash([7+depth*35*(.4+noise),13+depth*45*(1.3-noise),4+depth*17,18+noise*50]);ctx.lineDashOffset=-travel+noise*1500;ctx.stroke()
    }
    ctx.setLineDash([]);ctx.globalAlpha=1
  }
  const tick=(time:number)=>{
    const dt=last?Math.min((time-last)/1000,.1):0;last=time
    if(!props.paused&&!document.hidden)phase+=dt*props.speed
    if(needsPaint||((time-painted>33||!painted)&&!props.paused)){paint();painted=time;needsPaint=false}
    frame=requestAnimationFrame(tick)
  };frame=requestAnimationFrame(tick)
})
onBeforeUnmount(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
<template><canvas ref="canvas" class="river-water-canvas" aria-hidden="true"/></template>
<style scoped>.river-water-canvas{position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:screen;pointer-events:none}</style>
