<script setup lang="ts">
import type { SceneObjectId } from '#shared/scene-layout'
const props=defineProps<{kind:SceneObjectId}>()
const uid=`scene-${useId().replace(/[^a-zA-Z0-9-]/g,'')}`
const reflectionRipples=Array.from({length:56},(_,i)=>{
  const depth=i/55,spread=8+Math.pow(depth,1.15)*88,offset=Math.sin(i*12.7)*spread*.18
  const y=5+i*5.8+Math.sin(i*8.3)*1.4,gap=2+(i%5)*1.3
  return {d:`M${120-spread+offset} ${y}h${spread*.65}m${gap} 0h${spread*.45}`,width:.55+depth*.8,opacity:.25+(i%7)*.08}
})
</script>
<template>
  <div class="scene-art" :class="`scene-art-${props.kind}`" aria-hidden="true">
    <img v-if="kind==='moon'||kind==='prang'||kind==='chedis'" :src="`/scene/ayutthaya-v1/${kind}.webp`" alt="" draggable="false"/>
    <div v-if="kind==='prang'||kind==='chedis'" class="ruin-reflection"><img :src="`/scene/ayutthaya-v1/${kind}.webp`" alt="" draggable="false"/></div>
    <svg v-else-if="kind==='treeline'" viewBox="0 0 1600 160" preserveAspectRatio="none">
      <path d="M0 121Q21 100 47 113Q66 86 94 104Q113 64 140 98Q165 75 184 104Q211 83 234 116Q260 104 285 125Q310 97 337 110Q371 87 399 110Q429 82 455 110Q480 99 505 124Q540 100 566 114Q598 90 620 112Q654 80 679 103Q709 79 734 104Q765 91 790 119Q820 101 849 124Q876 96 903 113Q931 89 959 107Q991 84 1018 114Q1044 91 1070 111Q1104 81 1133 106Q1164 77 1191 112Q1221 86 1250 104Q1280 79 1308 108Q1342 88 1366 110Q1398 85 1427 112Q1459 86 1484 110Q1511 77 1537 104Q1570 78 1600 114V160H0Z" fill="#102d32"/>
      <path d="M0 137Q58 113 119 132T238 135T357 129T476 139T595 132T714 138T833 134T952 137T1071 128T1190 136T1309 130T1428 135T1547 131L1600 137V160H0Z" fill="#091f29"/>
      <g v-for="(x,i) in [72,172,1160,1360,1510]" :key="x" :transform="`translate(${x} ${i%2*12}) scale(${.8+(i%3)*.15})`" fill="#0b252b">
        <path d="M-4 144Q0 100 3 66L8 65Q9 111 3 144Z"/>
        <path d="M6 67Q-23 42-48 67Q-16 54 6 70Q-27 57-44 86Q-17 67 7 71Q-5 35 17 20Q3 46 9 69Q29 34 57 51Q28 49 9 71Q41 52 65 78Q35 64 9 73Q31 76 39 101Q24 80 6 73Z"/>
      </g>
      <path d="M0 151H1600" stroke="#bb975b" stroke-width=".8" opacity=".35"/>
    </svg>
    <div v-else-if="kind==='mist'" class="scene-mist-drift"/>
    <svg v-else-if="kind==='reflection'" viewBox="0 0 240 334" preserveAspectRatio="none">
      <defs><linearGradient :id="`${uid}-reflection`" gradientUnits="userSpaceOnUse" x1="120" y1="0" x2="120" y2="334"><stop stop-color="#e5c98b" stop-opacity="0"/><stop offset=".1" stop-color="#e5c98b" stop-opacity=".65"/><stop offset=".55" stop-color="#e7d3a0" stop-opacity=".35"/><stop offset="1" stop-color="#e7d3a0" stop-opacity="0"/></linearGradient><filter :id="`${uid}-soft`"><feGaussianBlur stdDeviation=".7"/></filter></defs>
      <g class="scene-reflection-ripples" :stroke="`url(#${uid}-reflection)`" fill="none" stroke-linecap="round" :filter="`url(#${uid}-soft)`">
        <path v-for="(ripple,i) in reflectionRipples" :key="i" :d="ripple.d" :stroke-width="ripple.width" :opacity="ripple.opacity"/>
      </g>
    </svg>
  </div>
</template>
<style scoped>
.scene-art,.scene-art img,.scene-art svg{display:block;width:100%;height:100%}.scene-art{position:relative;pointer-events:none}.scene-art img{object-fit:contain;object-position:center bottom;user-select:none}.scene-art-moon{border-radius:50%;filter:drop-shadow(0 0 18px #f6d59b44)}.scene-art-moon:before{content:'';position:absolute;inset:-90%;background:radial-gradient(circle,#e7d9aa10,transparent 65%);z-index:-1;pointer-events:none}.scene-art-prang,.scene-art-chedis{filter:drop-shadow(0 4px 6px #030e1b66)}.scene-mist-drift{position:absolute;inset:0;background:radial-gradient(ellipse at 20% 50%,#b6cece19,transparent 55%),radial-gradient(ellipse at 75% 54%,#dec59b14,transparent 50%);filter:blur(8px);animation:bank-mist calc(var(--scene-duration)*.4) ease-in-out infinite alternate}.scene-reflection-ripples{animation:reflected-light calc(var(--water-duration)*.32) ease-in-out infinite alternate;transform-origin:center}.scene-art-reflection{mix-blend-mode:screen}.scene-art-reflection:before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,#eed7a619,transparent 67%);filter:blur(8px)}.ruin-reflection{position:absolute;top:100%;left:0;width:100%;height:85%;overflow:hidden;opacity:.22;mask-image:linear-gradient(#000,transparent 82%);filter:blur(1px);animation:ruin-shimmer calc(var(--water-duration)*.3) ease-in-out infinite alternate}.ruin-reflection img{position:absolute;left:0;top:0;width:100%;height:117.65%;transform:scaleY(-1)}@keyframes ruin-shimmer{from{transform:skewX(-1deg) scaleX(.98);opacity:.14}to{transform:skewX(1deg) scaleX(1.02);opacity:.26}}@keyframes bank-mist{from{transform:translateX(-4%) scaleY(.7);opacity:.5}to{transform:translateX(4%) scaleY(1.1);opacity:1}}@keyframes reflected-light{0%{transform:translateX(-3px) scaleX(.85);opacity:.55}50%{opacity:.95}100%{transform:translateX(4px) scaleX(1.12);opacity:.7}}
</style>
