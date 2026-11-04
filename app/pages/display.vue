<script setup lang="ts">
import { EVENT_TITLE } from '#shared/event-brand'
const { t, eventText } = useAppI18n()
import { Maximize, Minimize, QrCode as QrIcon } from 'lucide-vue-next'
const {state,connected}=useLive();const origin=ref('');const full=ref(false);const controls=ref(true);let timer:ReturnType<typeof setTimeout>
const guestUrl=computed(()=>state.value.settings.guestUrl||origin.value)
onMounted(()=>{origin.value=location.origin;document.addEventListener('fullscreenchange',fullscreenChange);hideControls()})
onBeforeUnmount(()=>{clearTimeout(timer);document.removeEventListener('fullscreenchange',fullscreenChange)})
function fullscreenChange(){full.value=!!document.fullscreenElement}
function hideControls(){controls.value=true;clearTimeout(timer);timer=setTimeout(()=>controls.value=false,3500)}
async function toggleFull(){try{document.fullscreenElement?await document.exitFullscreen():await document.documentElement.requestFullscreen()}catch{}}
useHead(()=>({title:`${EVENT_TITLE} • ${t('สายน้ำแห่งคำอธิษฐาน')}`}))
</script>
<template><main class="display-page" :class="{'memorial-active':state.settings.showMemorial}" @mousemove="hideControls" @touchstart="hideControls">
<GalaFrame v-show="!state.settings.showMemorial" class="display-gala-frame"/><RiverScene v-show="!state.settings.showMemorial" :settings="state.settings" :krathongs="state.krathongs"/>
<MemorialScreen v-show="state.settings.showMemorial"/>
<div v-if="state.settings.showBrand" class="display-brand"><BrandMark/><span class="display-live"><i class="status-dot" :class="{'offline':!connected}"/>{{t(connected?'LIVE RIVER':'กำลังเชื่อมต่อใหม่')}}</span></div>
<div v-if="state.settings.showHeading||state.settings.showCount" class="display-heading"><template v-if="state.settings.showHeading"><p class="eyebrow">GALA DINNER · 25TH ASLOM</p><EventTitle :text="eventText(state.settings.title, 'title')"/><p>{{eventText(state.settings.subtitle, 'subtitle')}}</p></template><span v-if="state.settings.showCount" class="wish-counter">{{state.total.toLocaleString()}} <small>{{t('คำอธิษฐานร่วมกัน')}}</small></span></div>
<div v-if="state.settings.showQr&&guestUrl" class="display-qr"><div class="qr-wrap"><QrCode :value="guestUrl" :size="136"/></div><div><span class="eyebrow">MAKE A WISH</span><h3>{{t('สแกน แล้วลอยด้วยกัน')}}</h3><p>{{t('สร้างกระทงของคุณ')}}<br/>{{t('ให้ส่องประกายบนสายน้ำ')}}</p></div></div>
<div v-if="!state.total&&state.settings.showHeading" class="river-empty"><span>✧</span>{{t('สายน้ำกำลังรอคำอธิษฐานแรกของค่ำคืนนี้')}}</div>
<div v-if="state.settings.showControls" class="display-controls" :class="{visible:controls}"><LanguageSwitch/><NuxtLink to="/admin">{{t('จัดการงาน')}}</NuxtLink><NuxtLink to="/qr"><QrIcon :size="16"/>{{t('QR สำหรับโต๊ะ')}}</NuxtLink><button @click="toggleFull"><Minimize v-if="full" :size="18"/><Maximize v-else :size="18"/>{{t(full?'ออกจากเต็มจอ':'เต็มจอ')}}</button></div>
<span v-if="state.settings.showFooter" class="display-bottom-note">A LITTLE LIGHT. A SHARED MEMORY.</span>
</main></template>
