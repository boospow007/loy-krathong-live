<script setup lang="ts">
const { t, countryName } = useAppI18n()
import { ChevronDown, Check } from 'lucide-vue-next'
import { countries } from '#shared/countries'
const props=withDefaults(defineProps<{modelValue:string;id?:string}>(),{id:'country'})
const emit=defineEmits<{ 'update:modelValue':[value:string] }>()
const selected=computed(()=>countries.find(c=>c.code===props.modelValue)||countries[8]!)
const open=ref(false);const root=ref<HTMLElement>();const trigger=ref<HTMLButtonElement>();const activeIndex=ref(0)
const listId=computed(()=>`${props.id}-options`)
async function focusOption(index:number){activeIndex.value=(index+countries.length)%countries.length;await nextTick();root.value?.querySelectorAll<HTMLButtonElement>('[role="option"]')[activeIndex.value]?.focus()}
async function toggle(){open.value=!open.value;if(open.value)await focusOption(countries.findIndex(c=>c.code===props.modelValue))}
function choose(code:string){emit('update:modelValue',code);open.value=false;trigger.value?.focus()}
function close(){open.value=false;trigger.value?.focus()}
async function onKey(event:KeyboardEvent){
  if(event.key==='Escape'&&open.value){event.preventDefault();close()}
  else if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();const direction=event.key==='ArrowDown'?1:-1;if(!open.value){open.value=true;await focusOption(countries.findIndex(c=>c.code===props.modelValue))}else await focusOption(activeIndex.value+direction)}
  else if(open.value&&(event.key==='Home'||event.key==='End')){event.preventDefault();await focusOption(event.key==='Home'?0:countries.length-1)}
  else if(event.key==='Tab')open.value=false
}
function outside(event:PointerEvent){if(!root.value?.contains(event.target as Node))open.value=false}
onMounted(()=>document.addEventListener('pointerdown',outside));onBeforeUnmount(()=>document.removeEventListener('pointerdown',outside))
</script>
<template><div ref="root" class="country-picker" @keydown="onKey"><button :id="id" ref="trigger" type="button" class="country-trigger" aria-haspopup="listbox" :aria-expanded="open" :aria-controls="listId" @click="toggle"><CountryFlag :code="selected.code"/><span>{{countryName(selected.name)}}</span><ChevronDown :size="16"/></button><div v-if="open" :id="listId" class="country-options" role="listbox" :aria-label="t('เลือกประเทศหรืออาเซียน')"><button v-for="option in countries" :key="option.code" type="button" role="option" tabindex="-1" :aria-selected="modelValue===option.code" @click="choose(option.code)"><CountryFlag :code="option.code"/><span>{{countryName(option.name)}}</span><Check v-if="modelValue===option.code" :size="15"/></button></div></div></template>
