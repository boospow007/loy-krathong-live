<script setup lang="ts">
import { ArrowUpRight, ArrowRight, ArrowLeft, Check, Sparkles, Send, Radio, RotateCcw, Monitor, Leaf } from 'lucide-vue-next'
import { bases, flowers } from '#shared/models'
const {state,connected,loaded}=useLive()
const step=ref(1);const base=ref(0);const flower=ref(0);const name=ref('');const wish=ref('');const country=ref('TH');const sending=ref(false);const sent=ref(false);const pending=ref(false);const error=ref('');let submissionId=''
const titles=['เลือกฐานที่เป็นคุณ','เติมสีสันให้คำอธิษฐาน','ฝากความหวังไว้กับสายน้ำ']
async function submit(){if(sending.value)return;if(!name.value.trim()){error.value='ใส่ชื่อของคุณก่อนลอยกระทงนะ';return}error.value='';sending.value=true;try{submissionId ||= crypto.randomUUID();const r=await api('/krathongs',{method:'POST',body:{id:submissionId,base:base.value,flower:flower.value,name:name.value,wish:wish.value,country:country.value}});pending.value=r.status==='pending';sent.value=true}catch(e:any){error.value=e.message}finally{sending.value=false}}
function reset(){sent.value=false;step.value=1;name.value='';wish.value='';submissionId='';error.value=''}
useHead({title:'สร้างกระทงของคุณ • คืนจันทร์'})
</script>
<template>
<div class="guest-page">
<header class="site-header"><BrandMark/><nav><NuxtLink to="/display" target="_blank" class="header-link"><span class="status-dot"/> สายน้ำแห่งคำอธิษฐาน <ArrowUpRight :size="16"/></NuxtLink><NuxtLink to="/admin" class="admin-link">สำหรับผู้จัดงาน</NuxtLink></nav></header>
<main class="guest-layout">
<section class="guest-story">
  <p class="eyebrow"><span/> A NIGHT OF LIGHT & WISHES</p>
  <h1>หนึ่งกระทง<br/>พันความหวัง<span class="gold">.</span></h1>
  <p class="story-description">ฝากสิ่งดี ๆ ไว้กับแสงจันทร์<br/>แล้วให้สายน้ำพาคำอธิษฐานของคุณไป</p>
  <div class="preview-stage"><div class="preview-orbit"/><span class="preview-star star-one">✧</span><span class="preview-star star-two">✦</span><div class="preview-boat"><KrathongArt :base="base" :flower="flower" :country="step===3?country:''"/></div><div class="preview-ripple"/><span class="preview-caption">YOUR LITTLE LIGHT ON THE RIVER</span></div>
  <div class="live-counter"><div class="small-icon"><Radio :size="18"/></div><div><strong>{{state.total.toLocaleString()}} <span>คำอธิษฐานบนสายน้ำ</span></strong><small>{{connected?'เชื่อมต่อกับจอแสดงผลแล้ว':'กำลังเชื่อมต่อกับสายน้ำ…'}}</small></div></div>
  <p class="eco-note"><Leaf :size="14"/> งดงามในความทรงจำ อ่อนโยนต่อสายน้ำ</p>
</section>
<section class="composer" aria-label="สร้างกระทง">
<template v-if="!sent">
<div class="composer-top"><span class="eyebrow">CRAFT YOUR KRATHONG</span><span class="step-count">0{{step}} <span>/ 03</span></span></div>
<div class="stepper"><button v-for="(label,i) in ['เลือกฐานกระทง','เลือกดอกไม้','คำอธิษฐาน']" :key="label" :class="{active:step===i+1,done:step>i+1}" :disabled="i+1>step" @click="step=i+1;error=''"><span><Check v-if="step>i+1" :size="13"/><template v-else>{{i+1}}</template></span>{{label}}</button></div>
<div class="step-heading"><h2>{{titles[step-1]}}</h2><p>{{step===1?'เริ่มจากฐานกระทงที่ชอบ แต่ละแบบมีความหมายในตัวเอง':step===2?'เลือกดอกไม้แทนความรู้สึก ให้กระทงนี้พิเศษในแบบของคุณ':'เขียนชื่อและคำอวยพร ก่อนส่งกระทงของคุณขึ้นจอ'}}</p></div>
<div v-if="step<3" class="choice-grid"><button v-for="(item,i) in (step===1?bases:flowers)" :key="`${step}-${i}`" class="choice-card" :class="{selected:(step===1?base:flower)===i}" :aria-pressed="(step===1?base:flower)===i" @click="step===1?base=i:flower=i"><span class="selection-check"><Check :size="12"/></span><KrathongArt :base="step===1?i:base" :flower="step===1?0:i" :bare="step===1"/><strong>{{item.name}}</strong><small>{{item.story}}</small></button></div>
<form v-else id="wish-form" class="wish-form" @submit.prevent="submit">
<label for="guest-name">ชื่อของคุณ <span>*</span><span class="field-count">{{name.length}}/40</span></label><input id="guest-name" v-model="name" required maxlength="40" placeholder="อยากให้เรียกคุณว่าอะไร" autocomplete="given-name"/>
<label for="country">ประเทศ / Country</label><CountrySelect id="country" v-model="country"/>
<label for="wish">คำอธิษฐานของคุณ <span class="optional">(ไม่บังคับ)</span><span class="field-count">{{wish.length}}/160</span></label><textarea id="wish" v-model="wish" maxlength="160" rows="3" placeholder="ขอให้ค่ำคืนนี้เป็นจุดเริ่มต้นของสิ่งดี ๆ…"/>
<p class="privacy-note">ชื่อ ประเทศ และคำอวยพรจะแสดงบนจอในงาน<br/>กรุณาใช้ถ้อยคำสุภาพ และหลีกเลี่ยงข้อมูลส่วนตัว</p>
</form>
<p v-if="error" class="error-message" role="alert">{{error}}</p><p v-if="loaded&&!state.settings.accepting" class="error-message">ผู้จัดงานปิดรับกระทงชั่วคราว คุณยังออกแบบกระทงรอได้</p>
<footer class="composer-footer"><button v-if="step>1" class="text-button" @click="step--;error=''"><ArrowLeft :size="16"/> ย้อนกลับ</button><span v-else class="selection-summary"><Sparkles :size="14"/> ออกแบบด้วยใจ ในแบบของคุณ</span><button v-if="step<3" class="primary-button" @click="step++">{{step===1?'เลือกดอกไม้':'เขียนคำอธิษฐาน'}} <ArrowRight :size="17"/></button><button v-else form="wish-form" type="submit" class="primary-button" :disabled="sending||!connected||!state.settings.accepting">{{sending?'กำลังส่ง…':'ลอยกระทงขึ้นจอ'}}<Send :size="17"/></button></footer>
</template>
<div v-else class="success-panel" role="status"><span class="success-icon"><Check :size="30"/></span><p class="eyebrow">YOUR WISH IS ON ITS WAY</p><h2>{{pending?'คำอธิษฐานกำลังเดินทาง':'ให้สายน้ำพาความหวังไป'}}</h2><p>{{pending?'กระทงของคุณส่งถึงผู้จัดงานแล้ว และจะแสดงเมื่อผ่านการตรวจสอบ':'กระทงของคุณลอยขึ้นจอแล้ว มองหาแสงเล็ก ๆ ของคุณบนสายน้ำได้เลย'}}</p><blockquote v-if="wish">“{{wish}}”<small>— {{name}}</small></blockquote><NuxtLink to="/display" class="primary-button">ชมกระทงบนสายน้ำ <ArrowUpRight :size="16"/></NuxtLink><button class="text-button" @click="reset"><RotateCcw :size="15"/> สร้างกระทงอีกครั้ง</button></div>
</section>
</main>
<footer class="site-footer"><span>คืนจันทร์ · ทุกคำอธิษฐาน มีสายน้ำเป็นพยาน</span><span>MADE FOR A MOMENT TOGETHER <span class="gold">✧</span></span></footer>
</div>
</template>
