<script setup lang="ts">
import type { Krathong, Settings } from '#shared/models'
const props=defineProps<{boat:Krathong;settings:Settings;projectionScale:number}>()
const emit=defineEmits<{measure:[value:{above:number;below:number;width:number}]}>()
const root=ref<HTMLElement>(),art=ref<HTMLElement>(),wish=ref<HTMLElement>()
const hasName=computed(()=>props.boat.source!=='admin-random'&&props.settings.showNames&&!!props.boat.name.trim())
const hasWish=computed(()=>props.boat.source!=='admin-random'&&props.settings.showWishes&&!!props.boat.wish.trim())
const nameScale=computed(()=>(props.settings.nameScale??1)*props.projectionScale)
const wishScale=computed(()=>(props.settings.wishScale??1)*props.projectionScale)
let observer:ResizeObserver|undefined,lastAbove=-1,lastBelow=-1,lastWidth=-1
function measure(){
  if(!root.value||!art.value)return
  const artHeight=art.value.offsetHeight
  const above=hasWish.value?Math.max(0,(wish.value?.offsetHeight??0)-artHeight*.18+10):0
  const below=Math.max(0,root.value.offsetHeight-artHeight)
  const width=Math.max(root.value.offsetWidth,wish.value?.offsetWidth??0,root.value.querySelector<HTMLElement>('.krathong-name-label')?.offsetWidth??0)
  if(Math.abs(above-lastAbove)>.5||Math.abs(below-lastBelow)>.5||Math.abs(width-lastWidth)>.5){lastAbove=above;lastBelow=below;lastWidth=width;emit('measure',{above,below,width})}
}
function observe(){observer?.disconnect();if(root.value)observer?.observe(root.value);if(art.value)observer?.observe(art.value);if(wish.value)observer?.observe(wish.value);measure()}
onMounted(()=>{observer=new ResizeObserver(measure);observe()})
watch([hasName,hasWish,()=>props.boat.name,()=>props.boat.wish],()=>nextTick(observe),{flush:'post'})
onBeforeUnmount(()=>observer?.disconnect())
</script>
<template>
<div ref="root" class="floating-krathong-content" :style="{'--name-unit':`${nameScale}px`,'--wish-unit':`${wishScale}px`}">
  <div ref="art" class="boat-art-on-water">
    <div v-if="hasWish" ref="wish" class="krathong-wish-bubble">{{boat.wish}}</div>
    <div class="boat-wake"/>
    <KrathongArt :base="boat.base" :flower="boat.flower" :country="boat.country"/>
  </div>
  <div v-if="hasName" class="krathong-name-label">{{boat.name}}</div>
</div>
</template>
<style scoped>
.floating-krathong-content{text-align:center}.boat-art-on-water{position:relative;isolation:isolate}.boat-art-on-water .krathong-art{position:relative;display:block;width:100%;height:auto;z-index:1}.boat-wake{position:absolute;left:5%;bottom:1%;width:90%;height:8%;border-radius:50%;background:radial-gradient(ellipse,#d6bb781c,transparent 70%);border-bottom:1px solid #a6c2b522;box-shadow:0 3px 3px #05162144;animation:boat-wake calc(var(--water-duration)*.18) ease-in-out infinite alternate;z-index:0}.krathong-wish-bubble{position:absolute;left:50%;bottom:82%;transform:translateX(-50%);z-index:4;width:max-content;max-width:min(calc(240 * var(--wish-unit)),70vw);min-width:calc(70 * var(--wish-unit));padding:calc(9 * var(--wish-unit)) calc(13 * var(--wish-unit));border:1px solid #ddc38a88;border-radius:calc(11 * var(--wish-unit));background:linear-gradient(140deg,#19323bf5,#0b202bf5);box-shadow:0 4px 16px #020b1855;color:#f5ebd6;font-size:calc(12 * var(--wish-unit));line-height:1.65;overflow-wrap:anywhere;white-space:pre-wrap;text-shadow:none}.krathong-wish-bubble:after{content:'';position:absolute;left:calc(50% - 5px);bottom:-6px;width:10px;height:10px;background:#0e2530;border-right:1px solid #ddc38a88;border-bottom:1px solid #ddc38a88;transform:rotate(45deg)}.krathong-name-label{display:block;width:max-content;left:50%;transform:translateX(-50%);margin-top:calc(-6 * var(--name-unit));max-width:min(calc(220 * var(--name-unit)),70vw);border:1px solid #e8d29c44;background:#0a2029dd;color:#f2e7cb;border-radius:calc(15 * var(--name-unit));padding:calc(3 * var(--name-unit)) calc(12 * var(--name-unit));font-size:calc(12 * var(--name-unit));line-height:1.5;overflow-wrap:anywhere;position:relative;z-index:2}@keyframes boat-wake{from{transform:scaleX(.9);opacity:.45}to{transform:scaleX(1.14);opacity:.85}}
</style>
