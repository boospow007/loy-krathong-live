<script setup lang="ts">
import type { Settings, Krathong } from '#shared/models'
const props=withDefaults(defineProps<{settings:Settings;krathongs?:Krathong[];decorative?:boolean}>(),{krathongs:()=>[],decorative:false})
const elapsed=ref(0); const born=new Map<string,number>(); const sceneEl=ref<HTMLElement>(); const sceneWidth=ref(1920); let observer:ResizeObserver; let frame=0;let last=0
const demo=computed<Krathong[]>(()=>Array.from({length:9},(_,i)=>({id:`demo-${i}`,base:i%6,flower:(i+2)%6,country:'',name:'',wish:'',createdAt:0,status:'approved'})))
const boats=computed(()=>props.krathongs.length?props.krathongs:props.decorative?demo.value:[])
function hash(id:string){return Array.from(id).reduce((a,c)=>(a*31+c.charCodeAt(0))>>>0,0)}
function boatStyle(boat:Krathong,i:number){if(!born.has(boat.id))born.set(boat.id,elapsed.value);const age=elapsed.value-born.get(boat.id)!;const h=hash(boat.id);const depth=(h%100)/100;const x=(25+(h%997)/997*80+age*(1+depth*.6))%135-17;return {left:`${x}%`,top:`${54+depth*30}%`,width:`${(110+depth*100)*props.settings.size*Math.max(.55,sceneWidth.value/1920)}px`,zIndex:Math.round(10+depth*100),transform:`translate(-50%, ${Math.sin(elapsed.value*.3+i)*4}px)`,opacity: .75+depth*.25}}
onMounted(()=>{observer=new ResizeObserver(entries=>{sceneWidth.value=entries[0]!.contentRect.width});if(sceneEl.value)observer.observe(sceneEl.value);const tick=(time:number)=>{if(last&&!props.settings.paused)elapsed.value+=Math.min((time-last)/1000,.1)*props.settings.speed*.75;last=time;frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick)})
onBeforeUnmount(()=>{cancelAnimationFrame(frame);observer?.disconnect()})
</script>
<template>
<div ref="sceneEl" class="river-scene" :class="{'scene-paused':settings.paused,'scene-static':settings.sceneSpeed===0}" :style="{'--scene-duration':`${180/Math.max(.01,settings.sceneSpeed)}s`,'--water-duration':`${30/settings.waterSpeed}s`,filter:`brightness(${settings.brightness})`}">
  <div class="sky-layer"/>
  <div class="star-field"><i v-for="i in 48" :key="i" :style="{left:`${(i*37.17)%100}%`,top:`${(i*13.4)%47}%`,animationDelay:`${i%7}s`,opacity:(i%5+1)/7}"/></div>
  <div class="moon"><span/></div><div class="moon-halo"/>
  <svg class="mountain-layer far" viewBox="0 0 1600 500" preserveAspectRatio="none"><path d="M0 380Q100 260 230 342Q400 180 580 320Q780 240 900 350Q1100 170 1260 300Q1450 200 1600 330V500H0Z" fill="#142d40"/></svg>
  <svg class="mountain-layer near" viewBox="0 0 1600 500" preserveAspectRatio="none"><path d="M0 375Q160 320 330 390Q500 350 650 400Q900 310 1100 390Q1300 310 1600 370V500H0Z" fill="#0c2531"/>
  <g fill="#081b28"><path d="M0 389H85V350H105V328H115V295H122V328H132V350H153V385H182V345H199V319H207V275H213V319H221V345H240V385H275V369H300V347H310V315H316V347H326V369H355V410H0Z"/><path d="M1255 396V365H1280V338H1295V294H1301V338H1316V365H1345V393H1377V350H1397V318H1405V265H1411V318H1421V350H1442V393H1470V371H1495V344H1505V310H1511V344H1521V371H1550V390H1600V450H1255Z"/></g>
  <g fill="#e2be78" opacity=".6"><rect v-for="i in 9" :key="i" :x="40+i*32" y="385" width="3" height="5"/><rect v-for="i in 9" :key="`r${i}`" :x="1260+i*32" y="393" width="3" height="5"/></g></svg>
  <div class="river-layer"><div class="moon-reflection"/><svg class="water-lines" viewBox="0 0 1600 500" preserveAspectRatio="none"><g fill="none" stroke="#80aca6" stroke-width="1" opacity=".16"><path v-for="i in 20" :key="i" :d="`M-300 ${i*25}Q0 ${i*25-12} 300 ${i*25}T900 ${i*25}T1500 ${i*25}T2100 ${i*25}`"/></g></svg><div class="water-shine"/></div>
  <div class="lanterns"><i v-for="i in 6" :key="i" :style="{left:`${10+i*15}%`,animationDelay:`${i*-7}s`}"/></div>
  <div v-for="(boat,i) in boats" :key="boat.id" class="floating-boat" :style="boatStyle(boat,i)"><KrathongArt :base="boat.base" :flower="boat.flower" :country="boat.country"/><div v-if="settings.showNames&&boat.name" class="boat-name">{{boat.name}}</div><div v-if="settings.showWishes&&boat.wish" class="boat-wish">{{boat.wish}}</div></div>
  <div class="foreground-vignette"/>
</div>
</template>
