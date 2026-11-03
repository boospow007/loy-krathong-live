<script setup lang="ts">
import { EVENT_TITLE } from '#shared/event-brand'
withDefaults(defineProps<{text:string;as?:'h1'|'h2'}>(),{as:'h1'})
</script>
<template><component :is="as" :aria-label="text" :class="{'aslom-event-title':text===EVENT_TITLE}"><template v-if="text===EVENT_TITLE"><span>Gala Dinner</span><small>ASEAN Senior Law Officials Meeting</small><strong>25th ASLOM</strong></template><template v-else>{{text}}</template></component></template>
<style scoped>.aslom-event-title>span{display:block}.aslom-event-title>small{display:block;font-size:.53em;font-weight:400;line-height:1.5;color:#f6edd9;margin-top:3px}.aslom-event-title>strong{display:block;font-size:.48em;font-weight:400;letter-spacing:2px;line-height:1.5;margin-top:3px}</style>
