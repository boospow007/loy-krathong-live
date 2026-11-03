<script setup lang="ts">
import { EVENT_TITLE } from '#shared/event-brand'
const { t, eventText } = useAppI18n()
import { Printer, ArrowLeft } from 'lucide-vue-next'
const {state}=useLive();const origin=ref('');const url=computed(()=>state.value.settings.guestUrl||origin.value);onMounted(()=>origin.value=location.origin)
function print(){window.print()}
useHead(()=>({title:`${EVENT_TITLE} • ${t('QR สำหรับโต๊ะ')}`}))
</script>
<template><main class="qr-page"><div class="print-toolbar"><LanguageSwitch/><NuxtLink to="/admin" class="text-button"><ArrowLeft :size="16"/>{{t('กลับห้องควบคุม')}}</NuxtLink><button class="primary-button" @click="print"><Printer :size="17"/>{{t('พิมพ์ QR วางโต๊ะ')}}</button></div><article class="table-card"><BrandMark/><p class="eyebrow">GALA DINNER · 25TH ASLOM</p><h1>{{t('คืนนี้…')}}<br/>{{t('ลอยกระทงด้วยกัน')}}</h1><p>{{t('สแกนเพื่อสร้างกระทงของคุณ')}}<br/>{{t('แล้วส่งคำอธิษฐานขึ้นจอในงาน')}}</p><div class="table-qr"><QrCode v-if="url" :value="url" :size="250"/></div><div class="table-steps"><span>{{t('01 เลือกฐาน')}}</span><span>{{t('02 เติมดอกไม้')}}</span><span>{{t('03 อธิษฐาน')}}</span></div><KrathongArt :base="0" :flower="5"/><p class="table-event">{{eventText(state.settings.title, 'title')}}</p><small class="printed-url">{{url}}</small></article><p class="print-hint">{{t('ก่อนพิมพ์ ตรวจสอบว่า URL นี้เปิดได้จากมือถือของแขก')}}</p></main></template>
