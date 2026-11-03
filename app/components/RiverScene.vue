<script setup lang="ts">
import { packRiver } from '#shared/river-layout'
import type { Settings, Krathong } from '#shared/models'
import { resolveSceneLayout, sceneObjectIds, sceneObjectStyle } from '#shared/scene-layout'
const props=withDefaults(defineProps<{settings:Settings;krathongs?:Krathong[];decorative?:boolean}>(),{krathongs:()=>[],decorative:false})
const scene=computed(()=>resolveSceneLayout(props.settings.scene))
const elapsed=ref(0); const sceneEl=ref<HTMLElement>(); const sceneWidth=ref(1920); const sceneHeight=ref(1080); let observer:ResizeObserver; let frame=0;let last=0
const demo=computed<Krathong[]>(()=>Array.from({length:9},(_,i)=>({id:`demo-${i}`,base:i%6,flower:(i+2)%6,country:'',name:'',wish:'',createdAt:0,status:'approved'})))
const labelSizes=reactive<Record<string,{above:number;below:number;width:number}>>({})
const projectionScale=computed(()=>Math.max(.55,Math.min(sceneWidth.value/1280,sceneHeight.value/720)))
const boats=computed(()=>props.krathongs.length?props.krathongs:props.decorative?demo.value:[])
function hash(id:string){return Array.from(id).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0)}
function boatWidth(boat:Krathong){return (110+(hash(boat.id)%100))*props.settings.size*Math.max(.55,sceneWidth.value/1920)}
const cursor=ref(0)
const cycle=computed(()=>Math.floor(elapsed.value/18))
const placements=computed(()=>{
  const footprints=boats.value.filter(boat=>labelSizes[boat.id]).map(boat=>{const size=labelSizes[boat.id]!,artHeight=boatWidth(boat)*230/280;return {id:boat.id,width:Math.max(boatWidth(boat),size.width),height:artHeight+size.above+size.below,artHeight,above:size.above,below:size.below}})
  return new Map(packRiver(footprints,sceneWidth.value,sceneHeight.value,scene.value.riverY,cursor.value%Math.max(1,footprints.length)).map(item=>[item.id,item]))
})
watch(cycle,()=>{cursor.value=(cursor.value+Math.max(1,placements.value.size))%Math.max(1,boats.value.length)})
watch(()=>boats.value.map(boat=>boat.id).join(','),()=>{cursor.value=0})
function boatStyle(boat:Krathong,i:number){
  const slot=placements.value.get(boat.id),width=boatWidth(boat)
  if(!slot)return {width:`${width}px`,left:'-10000px',top:'0',visibility:'hidden' as const}
  const phase=elapsed.value%18
  const fading=!props.settings.paused&&boats.value.length>placements.value.size?Math.min(1,cycle.value===0?1:phase/.7,(18-phase)/.7):1
  return {left:`${slot.x}px`,top:`${slot.y}px`,width:`${width}px`,zIndex:Math.round(slot.y),transformOrigin:'50% 0',transform:`translate(calc(-${width*slot.scale/2}px + ${Math.sin(elapsed.value*.13+i)*3}px), ${Math.sin(elapsed.value*.3+i)*2}px) scale(${slot.scale})`,opacity:fading}
}
watch(boats,value=>{const ids=new Set(value.map(boat=>boat.id));for(const id of Object.keys(labelSizes))if(!ids.has(id))delete labelSizes[id]})

onMounted(()=>{observer=new ResizeObserver(entries=>{sceneWidth.value=entries[0]!.contentRect.width;sceneHeight.value=entries[0]!.contentRect.height||1080});if(sceneEl.value)observer.observe(sceneEl.value);const tick=(time:number)=>{if(last&&!props.settings.paused)elapsed.value+=Math.min((time-last)/1000,.1)*props.settings.speed*.75;last=time;frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onBeforeUnmount(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
<template>
<div ref="sceneEl" class="river-scene thai-river-scene" :class="{'scene-paused':settings.paused,'scene-static':settings.sceneSpeed===0}" :style="{'--scene-duration':`${180/Math.max(.01,settings.sceneSpeed)}s`,'--water-duration':`${30/settings.waterSpeed}s`,filter:`brightness(${settings.brightness})`}">
  <div class="sky-layer"/>
  <div class="star-field" aria-hidden="true"><i v-for="i in 64" :key="i" :style="{left:`${(i*37.17)%100}%`,top:`${(i*13.4)%50}%`,animationDelay:`${i%7}s`,opacity:(i%5+1)/9}"/></div>
  <div class="thai-clouds" aria-hidden="true"/>
  <div class="thai-river" :style="{top:`${scene.riverY}%`}" aria-hidden="true"><div class="bank-lights"/><RiverWater :speed="settings.waterSpeed" :paused="settings.paused||settings.showMemorial"/><div class="water-depth"/></div>
  <div class="scene-objects" aria-hidden="true"><div v-for="id in sceneObjectIds" v-show="scene.elements[id].visible" :key="id" class="scene-object" :data-scene-object="id" :style="sceneObjectStyle(id,scene.elements[id])"><SceneObjectArt :kind="id"/></div></div>
  <div class="lanterns" aria-hidden="true"><i v-for="i in 6" :key="i" :style="{left:`${10+i*15}%`,animationDelay:`${i*-7}s`}"/></div>
  <div class="river-boats"><div v-for="(boat,i) in boats" :key="boat.id" class="floating-boat" :style="boatStyle(boat,i)"><FloatingKrathong :boat="boat" :settings="settings" :projection-scale="projectionScale" @measure="labelSizes[boat.id]=$event"/></div></div>
  <div class="foreground-vignette"/>
</div>
</template>
<style scoped>
.thai-river-scene{background:#07111e}.thai-river-scene .sky-layer{background:radial-gradient(ellipse at 74% 16%,#293e52 0%,transparent 35%),radial-gradient(ellipse at 40% 63%,#374248 0%,#192c40 37%,#0b192c 68%,#060e1c 100%)}.thai-river-scene .star-field{opacity:.7}.thai-clouds{position:absolute;left:-10%;top:17%;width:120%;height:37%;background:radial-gradient(ellipse at 15% 65%,#b7cad30b,transparent 40%),radial-gradient(ellipse at 75% 45%,#a4bfc80c,transparent 35%);filter:blur(12px);animation:thai-cloud-drift var(--scene-duration) ease-in-out infinite alternate;z-index:1}.thai-river{position:absolute;inset:54% 0 0;background:linear-gradient(#213b45 0%,#183a46 15%,#102c3e 48%,#091c2b 100%);z-index:2;overflow:hidden}.bank-lights{position:absolute;inset:0 0 auto;height:25%;background:radial-gradient(ellipse at 22% 0%,#c9914c24,transparent 40%),radial-gradient(ellipse at 80% 0%,#d7a25d18,transparent 35%);filter:blur(8px)}.water-depth{position:absolute;inset:0;background:linear-gradient(transparent 30%,#020d1e55)}.scene-objects{position:absolute;inset:0;z-index:3;pointer-events:none}.scene-object{position:absolute}.river-boats{position:absolute;inset:0;z-index:40;pointer-events:none}.scene-static .thai-clouds{animation-play-state:paused}.thai-river-scene .foreground-vignette{box-shadow:inset 0 -45px 80px #020c1955}@keyframes thai-cloud-drift{from{transform:translateX(-3%)}to{transform:translateX(3%)}}
</style>
