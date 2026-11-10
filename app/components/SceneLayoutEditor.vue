<script setup lang="ts">
import { Move, Maximize2, Minimize2, RotateCcw } from 'lucide-vue-next'
import type { Settings, Krathong } from '#shared/models'
import { clamp, createDefaultScene, resolveSceneLayout, sceneObjectIds, sceneObjects, sceneObjectStyle, type SceneLayout, type SceneObject, type SceneObjectId } from '#shared/scene-layout'
const props=defineProps<{settings:Settings;krathongs:Krathong[]}>()
const emit=defineEmits<{ 'update:scene':[value:SceneLayout] }>()
const {t,eventText}=useAppI18n()
const editing=ref(false),expanded=ref(false),stage=ref<HTMLElement>(),shell=ref<HTMLElement>(),expandButton=ref<HTMLButtonElement>()
const selected=ref<SceneObjectId|'water'>('moon')
const scene=computed(()=>resolveSceneLayout(props.settings.scene))
const current=computed(()=>scene.value.elements[selected.value==='water'?'moon':selected.value])
let drag:{id:SceneObjectId|'water';mode:'move'|'resize';x:number;y:number;rect:DOMRect;original:SceneObject;riverY:number;distance:number}|undefined
const rounded=(n:number)=>Math.round(n*100)/100
function changeField(key:Exclude<keyof SceneObject,'visible'>,event:Event){const value=Number((event.target as HTMLInputElement).value);if(!Number.isFinite(value)||selected.value==='water')return;const next=resolveSceneLayout(scene.value);const limits=key==='width'?[2,200]:key==='rotation'?[-180,180]:key==='opacity'?[0,1]:key==='z'?[1,20]:[-50,150];next.elements[selected.value][key]=rounded(clamp(value,limits[0]!,limits[1]!));emit('update:scene',next)}
function visibility(event:Event){if(selected.value==='water')return;const next=resolveSceneLayout(scene.value);next.elements[selected.value].visible=(event.target as HTMLInputElement).checked;emit('update:scene',next)}
function riverLevel(event:Event){const n=Number((event.target as HTMLInputElement).value);if(!Number.isFinite(n))return;const next=resolveSceneLayout(scene.value);next.riverY=rounded(clamp(n,30,75));emit('update:scene',next)}
function start(event:PointerEvent,id:SceneObjectId|'water',mode:'move'|'resize'){
  if(event.button!==0||!stage.value)return
  event.preventDefault();event.stopPropagation();selected.value=id
  const rect=stage.value.getBoundingClientRect(),original={...scene.value.elements[id==='water'?'moon':id]}
  const anchorX=rect.left+original.x/100*rect.width,anchorY=rect.top+original.y/100*rect.height
  drag={id,mode,x:event.clientX,y:event.clientY,rect,original,riverY:scene.value.riverY,distance:Math.max(10,Math.hypot(event.clientX-anchorX,event.clientY-anchorY))}
  ;(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId)
}
function move(event:PointerEvent){
  if(!drag)return
  const next=resolveSceneLayout(scene.value),dx=(event.clientX-drag.x)/drag.rect.width*100,dy=(event.clientY-drag.y)/drag.rect.height*100
  if(drag.id==='water')next.riverY=rounded(clamp(drag.riverY+dy,30,75))
  else if(drag.mode==='move'){next.elements[drag.id].x=rounded(clamp(drag.original.x+dx,-50,150));next.elements[drag.id].y=rounded(clamp(drag.original.y+dy,-50,150))}
  else{const ax=drag.rect.left+drag.original.x/100*drag.rect.width,ay=drag.rect.top+drag.original.y/100*drag.rect.height;const distance=Math.hypot(event.clientX-ax,event.clientY-ay);next.elements[drag.id].width=rounded(clamp(drag.original.width*distance/drag.distance,2,200))}
  emit('update:scene',next)
}
function stop(){drag=undefined}
function nudge(event:KeyboardEvent,id:SceneObjectId|'water'){
  if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return
  event.preventDefault();selected.value=id;const step=event.shiftKey?5:1,next=resolveSceneLayout(scene.value)
  if(id==='water'){if(event.key==='ArrowUp'||event.key==='ArrowDown')next.riverY=clamp(next.riverY+(event.key==='ArrowUp'?-step:step),30,75)}
  else{const key=event.key==='ArrowLeft'||event.key==='ArrowRight'?'x':'y';const delta=event.key==='ArrowLeft'||event.key==='ArrowUp'?-step:step;next.elements[id][key]=clamp(next.elements[id][key]+delta,-50,150)}
  emit('update:scene',next)
}
function toggleExpanded(){expanded.value=!expanded.value;if(expanded.value)nextTick(()=>shell.value?.focus());else nextTick(()=>expandButton.value?.focus())}
function closeOnEscape(event:KeyboardEvent){if(event.key==='Escape'&&expanded.value){event.stopPropagation();toggleExpanded()}}
function trapFocus(event:KeyboardEvent){if(!expanded.value||event.key!=='Tab'||!shell.value)return;const nodes=[...shell.value.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),[tabindex="0"]')];const first=nodes[0],last=nodes.at(-1);if(event.shiftKey&&(document.activeElement===first||document.activeElement===shell.value)){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}
watch(()=>props.settings.showMemorial,value=>{if(value){editing.value=false;expanded.value=false}})
</script>
<template>
<section ref="shell" class="scene-editor" :class="{'scene-editor-expanded':expanded}" :role="expanded?'dialog':undefined" :aria-modal="expanded?'true':undefined" :aria-label="t('จัดวางฉากกรุงเก่า')" tabindex="-1" @keydown="closeOnEscape" @keydown.tab="trapFocus">
  <div ref="stage" class="preview-screen scene-editor-stage">
    <MemorialScreen v-show="settings.showMemorial"/>
    <RiverScene v-show="!settings.showMemorial" :settings="settings" :krathongs="krathongs" decorative/>
    <div v-show="!settings.showMemorial&&settings.showHeading" class="mini-heading"><EventTitle as="h2" :text="eventText(settings.title,'title')"/><p>{{eventText(settings.subtitle,'subtitle')}}</p></div>
    <span v-if="!krathongs.length&&!settings.showMemorial&&!editing" class="demo-note">{{t('กระทงตัวอย่าง · ไม่แสดงบนจอจริง')}}</span>
    <div v-if="editing&&!settings.showMemorial" class="scene-editor-overlay">
      <template v-for="id in sceneObjectIds" :key="id">
        <div v-if="scene.elements[id].visible" class="scene-edit-box" :class="{selected:selected===id}" :style="{...sceneObjectStyle(id,scene.elements[id]),opacity:1,zIndex:selected===id?100:scene.elements[id].z}">
          <button class="scene-drag-target" :aria-label="`${t('ย้าย')} ${t(sceneObjects[id].label)}`" :aria-pressed="selected===id" @pointerdown="start($event,id,'move')" @pointermove="move" @pointerup="stop" @pointercancel="stop" @keydown="nudge($event,id)"><span>{{t(sceneObjects[id].label)}}</span></button>
          <button v-if="selected===id" class="scene-resize-handle" :aria-label="`${t('ปรับขนาด')} ${t(sceneObjects[id].label)}`" @pointerdown="start($event,id,'resize')" @pointermove="move" @pointerup="stop" @pointercancel="stop"/>
        </div>
      </template>
      <button class="waterline-handle" :class="{selected:selected==='water'}" :style="{top:`${scene.riverY}%`}" :aria-label="t('ย้ายแนวแม่น้ำ')" @pointerdown="start($event,'water','move')" @pointermove="move" @pointerup="stop" @pointercancel="stop" @keydown="nudge($event,'water')"><span>{{t('แนวแม่น้ำ')}}</span></button>
    </div>
  </div>
  <div class="scene-editor-bar"><button class="outline-button" :disabled="settings.showMemorial" :aria-pressed="editing" @click="editing=!editing"><Move :size="14"/>{{t(editing?'จัดวางเสร็จแล้ว':'จัดวางฉาก')}}</button><span>{{t(editing?'ลากเพื่อย้าย · จุดมุมเพื่อปรับขนาด':'สัดส่วน 16:9 · รองรับการแสดงผลเต็มจอ')}}</span><button ref="expandButton" class="icon-button" :disabled="settings.showMemorial" :aria-label="t(expanded?'ย่อพื้นที่จัดฉาก':'ขยายพื้นที่จัดฉาก')" @click="toggleExpanded"><Minimize2 v-if="expanded" :size="16"/><Maximize2 v-else :size="16"/></button></div>
  <div v-if="editing&&!settings.showMemorial" class="scene-editor-fields">
    <div class="scene-layer-select"><label for="scene-layer">{{t('องค์ประกอบฉาก')}}</label><select id="scene-layer" v-model="selected"><option v-for="id in sceneObjectIds" :key="id" :value="id">{{t(sceneObjects[id].label)}}</option><option value="water">{{t('แนวแม่น้ำ')}}</option></select></div>
    <template v-if="selected!=='water'">
      <div class="scene-number-grid">
        <label>X (%)<input aria-label="X (%)" type="number" :value="current.x" min="-50" max="150" step=".1" @input="changeField('x',$event)"/></label>
        <label>Y (%)<input aria-label="Y (%)" type="number" :value="current.y" min="-50" max="150" step=".1" @input="changeField('y',$event)"/></label>
        <label>{{t('ขนาด')}} (%)<input :aria-label="`${t('ขนาด')} (%)`" type="number" :value="current.width" min="2" max="200" step=".1" @input="changeField('width',$event)"/></label>
        <label>{{t('มุมหมุน')}} (°)<input :aria-label="t('มุมหมุน')" type="number" :value="current.rotation" min="-180" max="180" step="1" @input="changeField('rotation',$event)"/></label>
      </div>
      <div class="scene-secondary-fields"><label>{{t('ความโปร่งใส')}}<input :aria-label="t('ความโปร่งใส')" type="range" :value="current.opacity" min="0" max="1" step=".05" @input="changeField('opacity',$event)"/></label><label>{{t('ลำดับเลเยอร์')}}<input :aria-label="t('ลำดับเลเยอร์')" type="number" :value="current.z" min="1" max="20" step="1" @input="changeField('z',$event)"/></label><label class="scene-visibility"><input type="checkbox" :checked="current.visible" @change="visibility"/>{{t('แสดงองค์ประกอบ')}}</label></div>
    </template>
    <label v-else>{{t('ระดับแนวแม่น้ำ')}} (%)<input :aria-label="t('ระดับแนวแม่น้ำ')" type="range" :value="scene.riverY" min="30" max="75" step=".1" @input="riverLevel"/><output>{{scene.riverY}}%</output></label>
    <div class="scene-editor-footer"><small>{{t('ปุ่มลูกศรเพื่อขยับ · Shift เพื่อขยับครั้งละ 5%')}}</small><button class="text-button" @click="emit('update:scene',createDefaultScene())"><RotateCcw :size="13"/>{{t('คืนค่าฉากเริ่มต้น')}}</button></div>
  </div>
</section>
</template>
<style scoped>
.scene-editor{outline:none}.scene-editor-stage{width:100%;container-type:inline-size}.scene-editor-stage .mini-heading{top:8%}.scene-editor-stage .mini-heading h2{font-size:clamp(12px,3.4cqw,28px)}.scene-editor-stage .mini-heading p{font-size:clamp(6px,1.15cqw,12px)}.scene-editor-overlay{position:absolute;inset:0;z-index:145;overflow:hidden;touch-action:none}.scene-edit-box{position:absolute;border:1px dashed #e6d4a566;pointer-events:none}.scene-edit-box.selected{border:1px solid #ecd09a;box-shadow:0 0 0 1px #071c29aa;background:#dcca9210}.scene-drag-target{position:absolute;inset:0;width:100%;height:100%;pointer-events:auto;cursor:move;touch-action:none;padding:0}.scene-drag-target>span{position:absolute;left:0;top:0;padding:3px 6px;background:#081b2ce6;color:#f1d8a8;font-size:9px;white-space:nowrap;transform:translateY(-100%)}.scene-edit-box.selected .scene-drag-target>span{background:#d9bd85;color:#172b32}.scene-resize-handle{position:absolute;right:-6px;bottom:-6px;width:13px;height:13px;border:2px solid #102631;border-radius:2px;background:#f3d39b;pointer-events:auto;touch-action:none;cursor:nwse-resize;z-index:30;padding:0}.waterline-handle{position:absolute;left:0;right:0;width:100%;height:14px;transform:translateY(-50%);border-top:1px dashed #92c5cf88;pointer-events:auto;touch-action:none;cursor:ns-resize;z-index:110;padding:0}.waterline-handle span{position:absolute;right:8px;top:0;font-size:8px;color:#c4e8ed;background:#0a2637bb;padding:2px 5px}.waterline-handle.selected{border-color:#c3e8ef}.scene-editor-bar{display:flex;align-items:center;gap:12px;padding:12px 16px;border-top:1px solid var(--line)}.scene-editor-bar>span{flex:1;font-size:9px;color:var(--muted)}.scene-editor-bar .outline-button{white-space:nowrap;font-size:10px}.scene-editor-bar .outline-button[aria-pressed=true]{background:#d7bc8520;color:var(--gold);border-color:#d7bc8566}.scene-editor-fields{padding:0 16px 16px;border-top:1px solid var(--line)}.scene-layer-select{display:flex;align-items:center;gap:12px;margin:14px 0}.scene-layer-select label{margin:0;font-size:10px;white-space:nowrap}.scene-layer-select select{font-size:11px;padding:9px}.scene-number-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.scene-number-grid label,.scene-secondary-fields label{margin:0;font-size:10px;color:var(--muted)}.scene-number-grid input,.scene-secondary-fields input[type=number]{margin-top:5px;padding:9px 8px;font-size:12px}.scene-secondary-fields{display:grid;grid-template-columns:1.4fr .7fr 1.2fr;gap:16px;margin-top:16px;align-items:center}.scene-secondary-fields input[type=range]{margin-top:9px}.scene-visibility{display:flex;align-items:center;gap:7px}.scene-visibility input{width:15px;accent-color:var(--gold)}.scene-editor-footer{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:17px}.scene-editor-footer small{font-size:8px;color:var(--muted)}.scene-editor-footer .text-button{font-size:9px;gap:5px}.scene-editor-expanded{position:fixed;inset:16px;z-index:300;background:#0b232e;border:1px solid #c7d3cd33;border-radius:12px;overflow:auto;padding:14px;box-shadow:0 0 0 30px #020b15e6;display:flex;flex-direction:column;align-items:stretch}.scene-editor-expanded .scene-editor-stage{max-width:min(100%,calc((100dvh - 160px)*16/9));margin:0 auto;flex-shrink:0}.scene-editor-expanded .scene-editor-fields{max-width:1100px;width:100%;margin:0 auto}.scene-editor-expanded .scene-editor-bar{flex-shrink:0}.scene-editor-expanded .scene-drag-target>span{font-size:11px}@media(max-width:600px){.scene-editor-bar{gap:7px;padding:10px}.scene-editor-bar>span{font-size:8px}.scene-number-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.scene-secondary-fields{gap:10px;grid-template-columns:1.1fr .8fr 1.2fr}.scene-editor-footer{align-items:flex-start;flex-direction:column}.scene-editor-expanded{inset:6px;padding:6px}.scene-editor-expanded:has(.scene-editor-fields) .scene-editor-stage{max-width:100%}.scene-layer-select{align-items:flex-start;flex-direction:column;gap:6px}}
</style>
