<script setup lang="ts">
const uid=`gala-${useId().replace(/[^a-zA-Z0-9-]/g,'')}`
</script>
<template>
<svg class="gala-frame" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
  <defs>
    <linearGradient :id="`${uid}-gold`"><stop stop-color="#a97b31"/><stop offset=".25" stop-color="#f6dda0"/><stop offset=".55" stop-color="#c79942"/><stop offset=".8" stop-color="#ffedb5"/><stop offset="1" stop-color="#b28a43"/></linearGradient>
    <pattern :id="`${uid}-weave`" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M16 3L29 16L16 29L3 16Z M16 9L23 16L16 23L9 16Z" fill="none" stroke="#e8c77c" stroke-width=".6" opacity=".4"/></pattern>
    <g :id="`${uid}-flower`"><path d="M0-8Q-24-36 0-58Q24-36 0-8Z M8 0Q36-24 58 0Q36 24 8 0Z M0 8Q24 36 0 58Q-24 36 0 8Z M-8 0Q-36 24-58 0Q-36-24-8 0Z"/><circle r="10" fill="none" stroke="currentColor" stroke-width="3"/><circle r="4"/></g>
  </defs>
  <g class="gala-flowers" fill="#dabd7e" color="#dabd7e"><use :href="`#${uid}-flower`" transform="translate(1450 115) scale(.9)"/><use :href="`#${uid}-flower`" transform="translate(1540 225) scale(.42)"/><use :href="`#${uid}-flower`" transform="translate(1360 55) scale(.38)"/><use :href="`#${uid}-flower`" transform="translate(80 280) scale(.5)"/></g>
  <path d="M-30 0H490Q255 140-30 164Z" :fill="`url(#${uid}-gold)`"/>
  <path d="M-30 0H447Q231 114-30 140Z" fill="#8f1d2a"/>
  <path d="M-30 0H447Q231 114-30 140Z" :fill="`url(#${uid}-weave)`"/>
  <path d="M-30 0H375Q190 82-30 103Z" :fill="`url(#${uid}-gold)`"/>
  <path d="M-30 0H346Q173 67-30 87Z" fill="#112150"/>
  <path d="M1050 900Q1330 875 1630 804V900Z" :fill="`url(#${uid}-gold)`"/>
  <path d="M1150 900Q1395 873 1630 826V883Q1390 905 1150 900Z" fill="#961f2b"/>
  <path d="M1150 900Q1395 873 1630 826V883Q1390 905 1150 900Z" :fill="`url(#${uid}-weave)`"/>
</svg>
</template>
<style scoped>.gala-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:hidden}.gala-flowers{opacity:.075}</style>
