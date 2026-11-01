<script setup lang="ts">
const { locale } = useAppI18n()
</script>
<template><div class="language-switch" role="group" :aria-label="locale==='en'?'Language':'ภาษา'"><button type="button" lang="en" :aria-pressed="locale==='en'" aria-label="English" @click="locale='en'">EN</button><button type="button" lang="th" :aria-pressed="locale==='th'" aria-label="ไทย" @click="locale='th'">ไทย</button></div></template>
