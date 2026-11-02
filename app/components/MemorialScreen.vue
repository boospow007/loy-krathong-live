<script setup lang="ts">
const { t } = useAppI18n()
</script>

<template>
  <div class="memorial-screen">
    <img src="/display/remembrance-v1.jpg" :alt="t('ภาพถวายอาลัย')" width="1920" height="1080" decoding="async"/>
  </div>
</template>

<style scoped>
.memorial-screen{position:absolute;inset:0;z-index:140;background:#000}
.memorial-screen img{display:block;width:100%;height:100%;object-fit:contain}
</style>
