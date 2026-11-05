<script setup lang="ts">
const { t, eventText } = useAppI18n()
import { ArrowUpRight, ArrowRight, ArrowLeft, Check, Sparkles, Send, Radio, RotateCcw, Monitor, Leaf } from 'lucide-vue-next'
import { bases, flowers } from '#shared/models'
import { EVENT_TITLE } from '#shared/event-brand'
const {state,connected,loaded}=useLive()
const step=ref(1);const base=ref(0);const flower=ref(5);const name=ref('');const wish=ref('');const country=ref('TH');const sending=ref(false);const sent=ref(false);const pending=ref(false);const error=ref('');let submissionId=''
const titles=['เลือกฐานที่เป็นคุณ','เติมสีสันให้คำอธิษฐาน','ฝากความหวังไว้กับสายน้ำ']
async function submit(){if(sending.value)return;if(!name.value.trim()){error.value='ใส่ชื่อของคุณก่อนลอยกระทงนะ';return}error.value='';sending.value=true;try{submissionId ||= crypto.randomUUID();const r=await api('/krathongs',{method:'POST',body:{id:submissionId,base:base.value,flower:flower.value,name:name.value,wish:wish.value,country:country.value}});pending.value=r.status==='pending';sent.value=true}catch(e:any){error.value=e.message}finally{sending.value=false}}
function reset(){sent.value=false;step.value=1;name.value='';wish.value='';submissionId='';error.value=''}
useHead(()=>({title:EVENT_TITLE}))
</script>
<template>
<div class="guest-page"><GalaFrame/>
<header class="site-header"><BrandMark/><nav><LanguageSwitch/><NuxtLink to="/display" target="_blank" class="header-link"><span class="status-dot"/>{{t('สายน้ำแห่งคำอธิษฐาน')}}<ArrowUpRight :size="16"/></NuxtLink><NuxtLink to="/admin" class="admin-link">{{t('สำหรับผู้จัดงาน')}}</NuxtLink></nav></header>
<main class="guest-layout">
<section class="guest-story">
  <p class="eyebrow"><span/> THE 25TH ASLOM · THAILAND</p>
  <h1 class="gala-hero-title" :aria-label="EVENT_TITLE"><span>GALA</span><em>dinner</em></h1><p class="gala-meeting">ASEAN Senior Law Officials Meeting <span>25th ASLOM</span></p>
  <p class="story-description">{{t('ฝากสิ่งดี ๆ ไว้กับแสงจันทร์')}}<br/>{{t('แล้วให้สายน้ำพาคำอธิษฐานของคุณไป')}}</p>
  <div class="preview-stage"><div class="preview-orbit"/><span class="preview-star star-one">✧</span><span class="preview-star star-two">✦</span><div class="preview-boat"><KrathongArt :base="base" :flower="flower" :country="step===3?country:''"/></div><div class="preview-ripple"/><span class="preview-caption">YOUR LITTLE LIGHT ON THE RIVER</span></div>
  <div class="live-counter"><div class="small-icon"><Radio :size="18"/></div><div><strong>{{state.total.toLocaleString()}} <span>{{t('คำอธิษฐานบนสายน้ำ')}}</span></strong><small>{{t(connected?'เชื่อมต่อกับจอแสดงผลแล้ว':'กำลังเชื่อมต่อกับสายน้ำ…')}}</small></div></div>
  <p class="eco-note"><Leaf :size="14"/>{{t('งดงามในความทรงจำ อ่อนโยนต่อสายน้ำ')}}</p>
</section>
<section class="composer" :aria-label="t('สร้างกระทง')">
<template v-if="!sent">
<div class="mobile-krathong-preview" role="region" :aria-label="t('ตัวอย่างกระทงของคุณ')">
  <KrathongArt :base="base" :flower="flower" :country="step===3?country:''"/>
  <div><span class="eyebrow">{{t('ตัวอย่างกระทงของคุณ')}}</span><p aria-live="polite">{{t(bases[base]!.name)}}<br/>{{t(flowers[flower]!.name)}}</p><small>{{t('เลือกแล้วดูตัวอย่างได้ทันที')}}</small></div>
</div>
<div class="composer-top"><span class="eyebrow">CRAFT YOUR KRATHONG</span><span class="step-count">0{{step}} <span>/ 03</span></span></div>
<div class="stepper"><button v-for="(label,i) in ['เลือกฐานกระทง','เลือกดอกไม้','คำอธิษฐาน']" :key="label" :class="{active:step===i+1,done:step>i+1}" :disabled="i+1>step" @click="step=i+1;error=''"><span><Check v-if="step>i+1" :size="13"/><template v-else>{{i+1}}</template></span>{{t(label)}}</button></div>
<div class="step-heading"><h2>{{t(titles[step-1])}}</h2><p>{{t(step===1?'เริ่มจากฐานกระทงที่ชอบ แต่ละแบบมีความหมายในตัวเอง':step===2?'เลือกดอกไม้แทนความรู้สึก ให้กระทงนี้พิเศษในแบบของคุณ':'เขียนชื่อและคำอวยพร ก่อนส่งกระทงของคุณขึ้นจอ')}}</p></div>
<div v-if="step<3" class="choice-grid"><button v-for="(item,i) in (step===1?bases:flowers)" :key="`${step}-${i}`" class="choice-card" :class="{selected:(step===1?base:flower)===i}" :aria-pressed="(step===1?base:flower)===i" @click="step===1?base=i:flower=i"><span class="selection-check"><Check :size="12"/></span><KrathongArt v-if="step===1" :base="i" bare/><img v-else class="flower-option-art" :src="`/krathongs/natural-v1/flower-${i}.webp`" :alt="t(item.name)" width="192" height="120" decoding="async"/><strong>{{t(item.name)}}</strong><small>{{t(item.story)}}</small></button></div>
<form v-else id="wish-form" class="wish-form" @submit.prevent="submit">
<label for="guest-name">{{t('ชื่อของคุณ')}}<span>*</span><span class="field-count">{{name.length}}/40</span></label><input id="guest-name" v-model="name" required maxlength="40" :placeholder="t('อยากให้เรียกคุณว่าอะไร')" autocomplete="given-name"/>
<label for="country">{{t('ประเทศ / Country')}}</label><CountrySelect id="country" v-model="country"/>
<label for="wish">{{t('คำอธิษฐานของคุณ')}}<span class="optional">{{t('(ไม่บังคับ)')}}</span><span class="field-count">{{wish.length}}/160</span></label><textarea id="wish" v-model="wish" maxlength="160" rows="3" :placeholder="t('ขอให้ค่ำคืนนี้เป็นจุดเริ่มต้นของสิ่งดี ๆ…')"/>
<p class="privacy-note">{{t('ชื่อ ประเทศ และคำอวยพรจะแสดงบนจอในงาน')}}<br/>{{t('กรุณาใช้ถ้อยคำสุภาพ และหลีกเลี่ยงข้อมูลส่วนตัว')}}</p>
</form>
<p v-if="error" class="error-message" role="alert">{{t(error)}}</p><p v-if="loaded&&!state.settings.accepting" class="error-message">{{t('ผู้จัดงานปิดรับกระทงชั่วคราว คุณยังออกแบบกระทงรอได้')}}</p>
<footer class="composer-footer"><button v-if="step>1" class="text-button" @click="step--;error=''"><ArrowLeft :size="16"/>{{t('ย้อนกลับ')}}</button><span v-else class="selection-summary"><Sparkles :size="14"/>{{t('ออกแบบด้วยใจ ในแบบของคุณ')}}</span><button v-if="step<3" class="primary-button" @click="step++">{{t(step===1?'เลือกดอกไม้':'เขียนคำอธิษฐาน')}} <ArrowRight :size="17"/></button><button v-else form="wish-form" type="submit" class="primary-button" :disabled="sending||!connected||!state.settings.accepting">{{t(sending?'กำลังส่ง…':'ลอยกระทงขึ้นจอ')}}<Send :size="17"/></button></footer>
</template>
<div v-else class="success-panel" role="status"><span class="success-icon"><Check :size="30"/></span><p class="eyebrow">YOUR WISH IS ON ITS WAY</p><h2>{{t(pending?'คำอธิษฐานกำลังเดินทาง':'ให้สายน้ำพาความหวังไป')}}</h2><p>{{t(pending?'กระทงของคุณส่งถึงผู้จัดงานแล้ว และจะแสดงเมื่อผ่านการตรวจสอบ':'กระทงของคุณลอยขึ้นจอแล้ว มองหาแสงเล็ก ๆ ของคุณบนสายน้ำได้เลย')}}</p><blockquote v-if="wish">“{{wish}}”<small>— {{name}}</small></blockquote><NuxtLink to="/display" class="primary-button">{{t('ชมกระทงบนสายน้ำ')}}<ArrowUpRight :size="16"/></NuxtLink><button class="text-button" @click="reset"><RotateCcw :size="15"/>{{t('สร้างกระทงอีกครั้ง')}}</button></div>
</section>
</main>
<footer class="site-footer"><span>Gala Dinner · 25th ASLOM</span><span>MADE FOR A MOMENT TOGETHER <span class="gold">✧</span></span></footer>
</div>
</template>

<style scoped>
.mobile-krathong-preview{display:none}
@media(max-width:800px){
  .mobile-krathong-preview{display:grid;grid-template-columns:130px minmax(0,1fr);align-items:center;gap:14px;position:sticky;top:0;z-index:20;margin:-25px -25px 22px;padding:10px 20px;background:linear-gradient(120deg,#183448,#101f3d);border-bottom:1px solid #d6bc7955;border-radius:15px 15px 0 0;box-shadow:0 8px 20px #020a1d33}
  .mobile-krathong-preview>.krathong-art{width:130px;height:auto}
  .mobile-krathong-preview .eyebrow{font-size:8px;letter-spacing:1px;line-height:1.5}
  .mobile-krathong-preview p{font-size:12px;color:#f4e7ca;line-height:1.7;margin:8px 0 4px}
  .mobile-krathong-preview small{font-size:9px;color:#a9c2cc;line-height:1.5;display:block}
}
@media(max-width:440px){.mobile-krathong-preview{margin:-20px -17px 20px;padding:8px 15px;gap:10px;border-radius:11px 11px 0 0}}
@media(max-width:800px) and (max-height:600px){.mobile-krathong-preview{grid-template-columns:100px minmax(0,1fr);padding-top:5px;padding-bottom:5px}.mobile-krathong-preview>.krathong-art{width:100px}.mobile-krathong-preview p{margin:3px 0;font-size:11px}.mobile-krathong-preview small{display:none}}

@media(max-width:800px){
  .guest-story>.eyebrow,.guest-story>.gala-meeting,.guest-story>.story-description,.guest-story>.preview-stage,.guest-story>.eco-note{display:none}
  .guest-page :deep(.site-header .brand small){display:none}
  .guest-page .site-header{height:68px;margin:0 20px}
  .guest-page .site-header nav{gap:10px}
  .guest-layout{padding:16px 18px 25px;gap:16px}
  .guest-story,.guest-story:lang(en){display:grid;grid-template-columns:1fr 1fr;align-items:center;min-height:0;padding:0 4px}
  .guest-story h1.gala-hero-title,.guest-story:lang(en) h1.gala-hero-title{font-size:36px;line-height:.95;width:auto;margin:4px 0 8px;letter-spacing:1px}
  .gala-hero-title>em{margin-left:16px;font-size:.78em;letter-spacing:-1px}
  .guest-story .live-counter{margin:0;gap:8px;justify-self:end}
  .guest-story .live-counter strong{font-size:15px}
  .guest-story .live-counter strong span{display:block;margin-left:0;font-size:9px}
  .guest-story .live-counter small{font-size:7px;max-width:130px;line-height:1.6}
  .guest-story .live-counter .small-icon{width:28px;height:28px}
}
</style>
