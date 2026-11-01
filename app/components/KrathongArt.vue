<script setup lang="ts">
const { t, flagLabel } = useAppI18n()
import { bases, flowers } from '#shared/models'
import { countries } from '#shared/countries'
const props=withDefaults(defineProps<{base?:number;flower?:number;country?:string;bare?:boolean}>(),{base:0,flower:0,country:'',bare:false})
const b=computed(()=>bases[props.base]||bases[0]); const f=computed(()=>flowers[props.flower]||flowers[0])
const countryOption=computed(()=>countries.find(c=>c.code===props.country))
const flag=computed(()=>countryOption.value?.flag)
const r=(n:number)=>Number(n.toFixed(3))
const petals=computed(()=>props.base===2?16:props.base===4?10:12)
</script>
<template>
<svg viewBox="0 0 280 230" class="krathong-art" role="img" :aria-label="`${t(b.name)} ${bare?'':t(f.name)}`">
  <ellipse cx="140" cy="205" rx="100" ry="12" fill="#dfb970" opacity=".13"/>
  <ellipse cx="140" cy="192" rx="85" ry="21" fill="#061e27" opacity=".5"/>
  <ellipse cx="140" cy="171" rx="94" ry="31" :fill="b.color" stroke="#c4b477" stroke-width="1"/>
  <path v-if="base===2" d="M49 166Q140 220 232 166L225 182Q140 221 55 182Z" fill="#876237"/>
  <path v-else d="M47 165Q140 215 233 165L225 183Q140 221 55 183Z" :fill="b.color"/>
  <g v-for="i in petals" :key="i" :transform="`translate(${r(140+Math.cos(i*Math.PI*2/petals)*75)},${r(162+Math.sin(i*Math.PI*2/petals)*22)}) rotate(${r(Math.cos(i*Math.PI*2/petals)*28)})`">
    <path :d="base===2?'M-11 8L-9 -18L0 -29L9 -18L11 8Q0 17 -11 8Z':base===4?'M-14 8Q-23 -5 0 -35Q23 -5 14 8Q0 17 -14 8Z':'M-14 8Q-22 -12 0 -39Q22 -12 14 8Q0 17 -14 8Z'" :fill="b.color" :stroke="b.edge" stroke-width="1.3"/>
    <path d="M0 -28L0 9" :stroke="b.edge" opacity=".6"/>
    <path v-if="base===3||base===4" d="M-6 -5L0 -17L6 -5L0 3Z" fill="#e1c47e" opacity=".7"/>
  </g>
  <ellipse cx="140" cy="161" rx="66" ry="23" fill="#183d38"/>
  <ellipse cx="140" cy="159" rx="61" ry="19" fill="#b0b86e" opacity=".35"/>
  <g v-for="i in 18" :key="`bead${i}`" :transform="`translate(${r(140+Math.cos(i*Math.PI/9)*81)},${r(172+Math.sin(i*Math.PI/9)*25)})`"><circle r="3" fill="#edd9a1"/><circle r="1.1" fill="#fff4c7"/></g>
  <template v-if="!bare">
    <g v-for="(pos,j) in [[98,150],[178,149],[113,168],[163,168]]" :key="`fl${j}`" :transform="`translate(${r(pos[0])},${r(pos[1])})`">
      <g v-for="i in (flower===2?12:6)" :key="i" :transform="`rotate(${r(i*360/(flower===2?12:6))})`"><ellipse cy="-9" :rx="flower===3?6:5" :ry="flower===2?10:8" :fill="flower===5?['#f0bc68','#e2abc7','#f0edda','#ce9ed4'][j]:f.color" stroke="#fff4df" stroke-opacity=".25"/></g><circle r="5" :fill="f.inner"/><circle r="2" fill="#deac50"/>
    </g>
    <g v-if="flower===0||flower===4||flower===5" transform="translate(140,139)">
      <path d="M0 19Q-47 13 -40 -18Q-13 -20 0 19Z" :fill="f.color"/><path d="M0 19Q47 13 40 -18Q13 -20 0 19Z" :fill="f.color"/>
      <path d="M0 18Q-35 0 -22 -31Q0 -21 0 18Z" :fill="f.inner"/><path d="M0 18Q35 0 22 -31Q0 -21 0 18Z" :fill="f.inner"/>
      <path d="M0 17Q-21 -6 0 -41Q21 -6 0 17Z" :fill="f.color" stroke="#fff2df" stroke-opacity=".5"/>
      <path d="M0 11Q-9 -5 0 -27Q9 -5 0 11Z" :fill="f.inner"/>
    </g>
    <g v-else transform="translate(140,137)"><g v-for="i in 9" :key="i" :transform="`rotate(${r(i*40)})`"><ellipse cy="-17" rx="10" ry="19" :fill="f.color" stroke="#fff" stroke-opacity=".22"/></g><g v-for="i in 7" :key="i" :transform="`rotate(${r(i*51)})`"><ellipse cy="-9" rx="6" ry="11" :fill="f.inner"/></g><circle r="6" fill="#e8bb62"/></g>
    <g stroke="#987b5b" stroke-width="2.2"><path d="M154 136L149 64M160 138L160 62M165 140L171 66"/></g>
    <g opacity=".3" fill="none" stroke="#cad8d3"><path class="smoke" d="M160 60C146 40 177 36 160 13"/></g>
    <rect x="130" y="76" width="9" height="60" rx="3" fill="#f2d592"/><path d="M132 77L132 130" stroke="#fff0be" stroke-width="2"/>
    <ellipse class="flame-glow" cx="134" cy="66" rx="20" ry="28" fill="#ffc15b" opacity=".14"/>
    <path class="flame" d="M134 78Q118 68 134 44Q151 67 134 78Z" fill="#f5b94e"/><path class="flame" d="M134 75Q127 67 134 56Q142 69 134 75Z" fill="#fff7c7"/>
  </template>
  <g v-if="countryOption&&!bare" role="img" :aria-label="flagLabel(countryOption.name)"><path d="M197 146L191 81" stroke="#d5b56d" stroke-width="2"/><image v-if="countryOption.flagImage" :href="countryOption.flagImage" x="191" y="81" width="39" height="26" preserveAspectRatio="xMidYMid meet"/><text v-else x="190" y="100" font-size="26">{{flag}}</text></g>
</svg>
</template>
