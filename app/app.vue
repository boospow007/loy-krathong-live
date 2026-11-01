<script setup lang="ts">
const { locale, t } = useAppI18n()
useHead(() => ({ htmlAttrs: { lang: locale.value }, meta: [{ name: 'description', content: t('ฝากคำอธิษฐานไปกับสายน้ำ สร้างกระทงของคุณแล้วลอยขึ้นจอพร้อมกัน') }] }))
</script>
<template><NuxtPage /></template>
