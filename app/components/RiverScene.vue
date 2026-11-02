<script setup lang="ts">
import type { Settings, Krathong } from '#shared/models'
import { resolveSceneLayout, sceneObjectIds, sceneObjectStyle } from '#shared/scene-layout'
const props=withDefaults(defineProps<{settings:Settings;krathongs?:Krathong[];decorative?:boolean}>(),{krathongs:()=>[],decorative:false})
const scene=computed(()=>resolveSceneLayout(props.settings.scene))
const elapsed=ref(0); const born=new Map<string,number>(); const sceneEl=ref<HTMLElement>(); const sceneWidth=ref(1920); const sceneHeight=ref(1080); let observer:ResizeObserver; let frame=0;let last=0
const demo=computed<Krathong[]>(()=>Array.from({length:9},(_,i)=>({id:`demo-${i}`,base:i%6,flower:(i+2)%6,country:'',name:'',wish:'',createdAt:0,status:'approved'})))
const boats=computed(()=>props.krathongs.length?props.krathongs:props.decorative?demo.value:[])
function hash(id:string){return Array.from(id).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0)}
function boatStyle(boat:Krathong,i:number){
  if(!born.has(boat.id))born.set(boat.id,elapsed.value)
  const age=elapsed.value-born.get(boat.id)!,h=hash(boat.id),depth=(h%100)/100
  const x=(25+(h%997)/997*80+age*(1+depth*.6))%135-17
  const width=(110+depth*100)*props.settings.size*Math.max(.55,sceneWidth.value/1920)
  const caption=(props.settings.showNames&&boat.name?22:0)+(props.settings.showWishes&&boat.wish?25:0)
  const lastRow=Math.max(0,98-(width*230/280+caption)/sceneHeight.value*100)
  const firstRow=Math.min(scene.value.riverY+2,lastRow)
  return {left:`${x}%`,top:`${firstRow+depth*(lastRow-firstRow)}%`,width:`${width}px`,zIndex:Math.round(10+depth*100),transform:`translate(-50%, ${Math.sin(elapsed.value*.3+i)*4}px)`,opacity:.75+depth*.25}
}
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
  <div class="river-boats"><div v-for="(boat,i) in boats" :key="boat.id" class="floating-boat" :style="boatStyle(boat,i)"><div class="boat-art-on-water"><div class="boat-wake"/><KrathongArt :base="boat.base" :flower="boat.flower" :country="boat.country"/></div><div v-if="settings.showNames&&boat.name" class="boat-name">{{boat.name}}</div><div v-if="settings.showWishes&&boat.wish" class="boat-wish">{{boat.wish}}</div></div></div>
  <div class="foreground-vignette"/>
</div>
</template>
<style scoped>
.thai-river-scene{background:#07111e}.thai-river-scene .sky-layer{background:radial-gradient(ellipse at 74% 16%,#293e52 0%,transparent 35%),radial-gradient(ellipse at 40% 63%,#374248 0%,#192c40 37%,#0b192c 68%,#060e1c 100%)}.thai-river-scene .star-field{opacity:.7}.thai-clouds{position:absolute;left:-10%;top:17%;width:120%;height:37%;background:radial-gradient(ellipse at 15% 65%,#b7cad30b,transparent 40%),radial-gradient(ellipse at 75% 45%,#a4bfc80c,transparent 35%);filter:blur(12px);animation:thai-cloud-drift var(--scene-duration) ease-in-out infinite alternate;z-index:1}.thai-river{position:absolute;inset:54% 0 0;background:linear-gradient(#213b45 0%,#183a46 15%,#102c3e 48%,#091c2b 100%);z-index:2;overflow:hidden}.bank-lights{position:absolute;inset:0 0 auto;height:25%;background:radial-gradient(ellipse at 22% 0%,#c9914c24,transparent 40%),radial-gradient(ellipse at 80% 0%,#d7a25d18,transparent 35%);filter:blur(8px)}.water-depth{position:absolute;inset:0;background:linear-gradient(transparent 30%,#020d1e55)}.scene-objects{position:absolute;inset:0;z-index:3;pointer-events:none}.scene-object{position:absolute}.river-boats{position:absolute;inset:0;z-index:40;pointer-events:none}.boat-art-on-water{position:relative;isolation:isolate}.boat-art-on-water .krathong-art{display:block;width:100%;height:auto;position:relative;z-index:1}.boat-wake{position:absolute;left:5%;bottom:1%;width:90%;height:8%;border-radius:50%;background:radial-gradient(ellipse,#d6bb781c,transparent 70%);border-bottom:1px solid #a6c2b522;box-shadow:0 3px 3px #05162144;animation:boat-wake calc(var(--water-duration)*.18) ease-in-out infinite alternate;z-index:0}.scene-static .thai-clouds{animation-play-state:paused}.thai-river-scene .foreground-vignette{box-shadow:inset 0 -45px 80px #020c1955}@keyframes thai-cloud-drift{from{transform:translateX(-3%)}to{transform:translateX(3%)}}@keyframes boat-wake{from{transform:scaleX(.9);opacity:.45}to{transform:scaleX(1.14);opacity:.85}}
</style>
