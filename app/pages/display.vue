<script setup lang="ts">
import { Maximize, Minimize, QrCode as QrIcon } from 'lucide-vue-next'
const {state,connected}=useLive();const origin=ref('');const full=ref(false);const controls=ref(true);let timer:ReturnType<typeof setTimeout>
const guestUrl=computed(()=>state.value.settings.guestUrl||origin.value)
onMounted(()=>{origin.value=location.origin;document.addEventListener('fullscreenchange',fullscreenChange);hideControls()})
onBeforeUnmount(()=>{clearTimeout(timer);document.removeEventListener('fullscreenchange',fullscreenChange)})
function fullscreenChange(){full.value=!!document.fullscreenElement}
function hideControls(){controls.value=true;clearTimeout(timer);timer=setTimeout(()=>controls.value=false,3500)}
async function toggleFull(){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{}}
useHead({title:'สายน้ำแห่งคำอธิษฐาน • คืนจันทร์'})
</script>
<template><main class="display-page" @mousemove="hideControls" @touchstart="hideControls">
<RiverScene :settings="state.settings" :krathongs="state.krathongs"/>
<div class="display-brand"><BrandMark/><span class="display-live"><i class="status-dot" :class="{'offline':!connected}"/>{{connected?'LIVE RIVER':'กำลังเชื่อมต่อใหม่'}}</span></div>
<div class="display-heading"><p class="eyebrow">A THOUSAND WISHES. ONE RIVER.</p><h1>{{state.settings.title}}</h1><p>{{state.settings.subtitle}}</p><span class="wish-counter">{{state.total.toLocaleString()}} <small>คำอธิษฐานร่วมกัน</small></span></div>
<div v-if="state.settings.showQr&&guestUrl" class="display-qr"><div class="qr-wrap"><QrCode :value="guestUrl" :size="136"/></div><div><span class="eyebrow">MAKE A WISH</span><h3>สแกน แล้วลอยด้วยกัน</h3><p>สร้างกระทงของคุณ<br/>ให้ส่องประกายบนสายน้ำ</p></div></div>
<div v-if="!state.total" class="river-empty"><span>✧</span> สายน้ำกำลังรอคำอธิษฐานแรกของค่ำคืนนี้</div>
<div class="display-controls" :class="{visible:controls}"><NuxtLink to="/admin">จัดการงาน</NuxtLink><NuxtLink to="/qr"><QrIcon :size="16"/> QR สำหรับโต๊ะ</NuxtLink><button @click="toggleFull"><Minimize v-if="full" :size="18"/><Maximize v-else :size="18"/>{{full?'ออกจากเต็มจอ':'เต็มจอ'}}</button></div>
<span class="display-bottom-note">A LITTLE LIGHT. A SHARED MEMORY.</span>
</main></template>
