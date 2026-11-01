<script setup lang="ts">
import { Printer, ArrowLeft } from 'lucide-vue-next'
const {state}=useLive();const origin=ref('');const url=computed(()=>state.value.settings.guestUrl||origin.value);onMounted(()=>origin.value=location.origin)
function print(){window.print()}
useHead({title:'QR สำหรับโต๊ะ • คืนจันทร์'})
</script>
<template><main class="qr-page"><div class="print-toolbar"><NuxtLink to="/admin" class="text-button"><ArrowLeft :size="16"/> กลับห้องควบคุม</NuxtLink><button class="primary-button" @click="print"><Printer :size="17"/> พิมพ์ QR วางโต๊ะ</button></div><article class="table-card"><BrandMark/><p class="eyebrow">A LITTLE LIGHT. A SHARED MEMORY.</p><h1>คืนนี้…<br/>ลอยกระทงด้วยกัน</h1><p>สแกนเพื่อสร้างกระทงของคุณ<br/>แล้วส่งคำอธิษฐานขึ้นจอในงาน</p><div class="table-qr"><QrCode v-if="url" :value="url" :size="250"/></div><div class="table-steps"><span>01 เลือกฐาน</span><span>02 เติมดอกไม้</span><span>03 อธิษฐาน</span></div><KrathongArt :base="1" :flower="0"/><p class="table-event">{{state.settings.title}}</p><small class="printed-url">{{url}}</small></article><p class="print-hint">ก่อนพิมพ์ ตรวจสอบว่า URL นี้เปิดได้จากมือถือของแขก</p></main></template>
