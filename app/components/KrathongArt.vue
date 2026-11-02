<script setup lang="ts">
import { useId } from 'vue'
import { getKrathongLayout } from '#shared/krathong-layout'
import { bases, flowers } from '#shared/models'
import { countries } from '#shared/countries'
const { t, flagLabel } = useAppI18n()
const props=withDefaults(defineProps<{base?:number;flower?:number;country?:string;bare?:boolean}>(),{base:0,flower:0,country:'',bare:false})
const baseIndex=computed(()=>Number.isInteger(props.base)&&props.base>=0&&props.base<6?props.base:0)
const flowerIndex=computed(()=>Number.isInteger(props.flower)&&props.flower>=0&&props.flower<6?props.flower:0)
const b=computed(()=>bases[baseIndex.value]!);const f=computed(()=>flowers[flowerIndex.value]!)
const countryOption=computed(()=>countries.find(c=>c.code===props.country))
const uid=`natural-${useId().replace(/[^a-zA-Z0-9-]/g,'')}`
const baseSrc=computed(()=>`/krathongs/natural-v1/base-${baseIndex.value}.webp`)
const flowerSrc=computed(()=>`/krathongs/natural-v1/flower-${flowerIndex.value}.webp`)
const layout=computed(()=>getKrathongLayout(baseIndex.value,flowerIndex.value))
</script>
<template>
<svg :viewBox="bare?'15 85 250 145':'0 0 280 230'" class="krathong-art natural-krathong" role="img" :aria-label="`${t(b.name)} ${bare?'':t(f.name)}`">
  <defs>
    <linearGradient :id="`${uid}-wax`" x1="0" x2="1"><stop stop-color="#af925a"/><stop offset=".35" stop-color="#f3dfaf"/><stop offset=".7" stop-color="#e4cb8f"/><stop offset="1" stop-color="#b69b63"/></linearGradient>
    <linearGradient :id="`${uid}-fire`" x1="0" y1="1" x2=".4" y2="0"><stop stop-color="#e27b23"/><stop offset=".45" stop-color="#f9c66a"/><stop offset="1" stop-color="#fff7d9"/></linearGradient>
    <linearGradient :id="`${uid}-bamboo`"><stop stop-color="#67553a"/><stop offset=".5" stop-color="#c5ac75"/><stop offset="1" stop-color="#8c754a"/></linearGradient>
    <filter :id="`${uid}-contact`" x="-20%" y="-100%" width="140%" height="300%"><feGaussianBlur stdDeviation="1"/></filter>
    <clipPath :id="`${uid}-front`"><path :d="layout.front" :transform="layout.transform"/></clipPath>
    <mask :id="`${uid}-flowers`" x="0" y="0" width="280" height="230" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" style="mask-type:luminance">
      <rect :x="layout.pocket.x" y="25" :width="layout.pocket.width" height="205" fill="white"/>
      <path :d="layout.front" :transform="layout.transform" fill="black"/>
    </mask>
  </defs>
  <ellipse v-if="!bare" cx="140" cy="215" rx="83" ry="9" fill="#071b1d" opacity=".24"/>
  <image :href="baseSrc" :x="layout.image.x" :y="layout.image.y" :width="layout.image.width" :height="layout.image.height" preserveAspectRatio="xMidYMax meet"/>
  <template v-if="!bare">
    <g class="natural-incense" stroke-linecap="round">
      <path d="M153 153L150 55" stroke="#66503c" stroke-width="1.6"/><path d="M159 154L160 52" stroke="#846447" stroke-width="1.5"/><path d="M164 154L170 58" stroke="#705039" stroke-width="1.5"/>
      <path d="M150 55L150 59M160 52L160 56M170 58L170 62" stroke="#ae5d35" stroke-width="1.3"/>
      <path d="M149.6 55L149.7 61M159.7 52L159.7 58M169.7 58L169.4 64" stroke="#c0b7a1" stroke-width=".7"/>
    </g>
    <path class="natural-smoke" d="M160 49C153 39 166 32 162 19" fill="none" stroke="#d4d3c3" stroke-width=".7" opacity=".18"/>
    <g class="natural-candle">
      <rect x="136" y="79" width="5.2" height="76" rx="1.4" :fill="`url(#${uid}-wax)`"/>
      <ellipse cx="138.6" cy="79.6" rx="2.6" ry="1.2" fill="#f5e7bd"/>
      <path d="M138.6 79L138.4 75.5" stroke="#59442a" stroke-width=".7"/>
      <path d="M137 92L137.5 105M140 116L140 127" stroke="#fff4d6" stroke-width=".7" opacity=".35"/>
      <ellipse cx="138.5" cy="71" rx="9" ry="15" fill="#edbb64" opacity=".055"/>
      <path class="candle-flame" d="M138.5 77C132.8 73 135.8 67 139 61C139.2 67 144.5 72 138.5 77Z" :fill="`url(#${uid}-fire)`"/>
      <path class="candle-flame" d="M138.5 76C136.2 73.5 137.3 70.5 138.8 68.5C140.5 72.3 140.2 74.4 138.5 76Z" fill="#fff4d3" opacity=".95"/>
    </g>
    <g :mask="`url(#${uid}-flowers)`">
      <ellipse cx="140" :cy="layout.pocket.bottom-1" :rx="layout.flowers.width*.44" ry="2.8" fill="#172013" opacity=".2" :filter="`url(#${uid}-contact)`"/>
      <image :href="flowerSrc" :x="layout.flowers.x" :y="layout.flowers.y" :width="layout.flowers.width" :height="layout.flowers.height" preserveAspectRatio="xMidYMax meet"/>
    </g>
    <g v-if="countryOption" role="img" :aria-label="flagLabel(countryOption.name)">
      <path d="M202 164L196 81" :stroke="`url(#${uid}-bamboo)`" stroke-width="1.6"/>
      <image v-if="countryOption.flagImage" :href="countryOption.flagImage" x="196" y="81" width="33" height="22" preserveAspectRatio="xMidYMid meet"/>
      <text v-else x="195" y="101" font-size="24">{{countryOption.flag}}</text>
    </g>
    <!-- The photographed front rim occludes flowers and the bottom of the flagpole. -->
    <image :href="baseSrc" :x="layout.image.x" :y="layout.image.y" :width="layout.image.width" :height="layout.image.height" preserveAspectRatio="xMidYMax meet" :clip-path="`url(#${uid}-front)`"/>
  </template>
</svg>
</template>
