<script setup lang="ts">
import { countries } from '#shared/countries'
const props=defineProps<{code:string}>()
const country=computed(()=>countries.find(c=>c.code===props.code))
</script>
<template><img v-if="country?.flagImage" class="country-flag" :src="country.flagImage" :alt="`ธง${country.name}`" width="27" height="18"/><span v-else-if="country" class="country-flag-emoji" role="img" :aria-label="`ธง${country.name}`">{{country.flag}}</span></template>
