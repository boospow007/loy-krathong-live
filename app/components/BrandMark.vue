<script setup lang="ts">
import { EVENT_TITLE } from '#shared/event-brand'
defineProps<{ hideTagline?: boolean }>()
</script>
<template><NuxtLink to="/" class="brand gala-brand" :aria-label="EVENT_TITLE"><svg viewBox="0 0 40 40" width="38" height="38" fill="none"><path d="M20 5Q10 16 20 25Q30 16 20 5Z" stroke="currentColor"/><path d="M20 25Q9 25 6 15Q20 12 20 25ZM20 25Q31 25 34 15Q20 12 20 25Z" stroke="currentColor"/><path d="M5 29Q20 38 35 29M10 34Q20 39 30 34" stroke="currentColor"/></svg><span>25<sup>th</sup> ASLOM<small v-if="!hideTagline">GALA DINNER · THAILAND</small></span></NuxtLink></template>
