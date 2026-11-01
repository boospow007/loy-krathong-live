<script setup lang="ts">
const { flagLabel } = useAppI18n()
import { countries } from '#shared/countries'
const props=defineProps<{code:string}>()
const country=computed(()=>countries.find(c=>c.code===props.code))
</script>
<template><img v-if="country?.flagImage" class="country-flag" :src="country.flagImage" :alt="flagLabel(country.name)" width="27" height="18"/><span v-else-if="country" class="country-flag-emoji" role="img" :aria-label="flagLabel(country.name)">{{country.flag}}</span></template>
