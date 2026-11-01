<script setup lang="ts">
const { t } = useAppI18n()
import QRCode from 'qrcode'
const props=defineProps<{value:string;size?:number}>()
const src=ref('');const error=ref(false)
watch(()=>props.value,async(value)=>{if(!value)return;try{src.value=await QRCode.toDataURL(value,{width:props.size||220,margin:2,errorCorrectionLevel:'M',color:{dark:'#112b32',light:'#ffffff'}});error.value=false}catch{error.value=true}},{immediate:true})
</script>
<template><img v-if="src" :src="src" :width="size||220" :height="size||220" :alt="`${t('QR code เปิด')} ${value}`"/><span v-else-if="error">{{t('สร้าง QR ไม่สำเร็จ')}}</span></template>
