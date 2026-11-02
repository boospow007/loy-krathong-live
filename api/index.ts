import { Elysia, t } from 'elysia'
import { createStore } from './store'
import { countries } from '../shared/countries'
import { defaults } from '../shared/models'
const sceneObjectSchema = t.Object({x:t.Number({minimum:-50,maximum:150}),y:t.Number({minimum:-50,maximum:150}),width:t.Number({minimum:2,maximum:200}),rotation:t.Number({minimum:-180,maximum:180}),opacity:t.Number({minimum:0,maximum:1}),visible:t.Boolean(),z:t.Integer({minimum:1,maximum:20})})
const sceneSchema = t.Object({riverY:t.Number({minimum:30,maximum:75}),elements:t.Object({moon:sceneObjectSchema,prang:sceneObjectSchema,chedis:sceneObjectSchema,treeline:sceneObjectSchema,mist:sceneObjectSchema,reflection:sceneObjectSchema})})
const password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV === 'production' ? '' : 'loy-local-admin')
if (!password || (process.env.NODE_ENV === 'production' && password.length < 12)) throw new Error('Set ADMIN_PASSWORD (at least 12 characters in production)')
export const store = await createStore()
const sessions = new Map<string, number>()
const streams = new Set<ReadableStreamDefaultController<Uint8Array>>()
const encoder = new TextEncoder()
async function broadcast() { const data = encoder.encode(`data: ${JSON.stringify(await store.state())}\n\n`); for (const stream of streams) { try { stream.enqueue(data) } catch { streams.delete(stream) } } }
const limits = new Map<string, { n: number; until: number }>()
function limited(key: string, max: number, window = 60_000) { const now = Date.now(); const record = limits.get(key); if (!record || record.until < now) { limits.set(key, { n: 1, until: now + window }); return false } return ++record.n > max }
setInterval(() => { const now=Date.now(); for (const [k,v] of limits) if(v.until<now) limits.delete(k); for (const [k,v] of sessions) if(v<now) sessions.delete(k) }, 60_000).unref()
const clean = (s:string) => s.trim().replace(/[\u0000-\u001f\u007f]/g, '')
export const app = new Elysia({ prefix: '/api' })
  .onBeforeHandle(({request, set}) => {
    if (['POST','PATCH','DELETE'].includes(request.method)) {
      const origin = request.headers.get('origin'); const forwarded = request.headers.get('x-forwarded-host') || request.headers.get('host')
      if (origin && new URL(origin).host !== forwarded) { set.status=403; return {error:'Origin ไม่ได้รับอนุญาต'} }
    }
  })
  .get('/health', () => ({ ok: true }))
  .get('/state', () => store.state())
  .get('/events', ({request}) => {
    let controller: ReadableStreamDefaultController<Uint8Array>; let heartbeat: ReturnType<typeof setInterval>
    const stream = new ReadableStream<Uint8Array>({ async start(c) { controller=c; streams.add(c); c.enqueue(encoder.encode(`retry: 2000\ndata: ${JSON.stringify(await store.state())}\n\n`)); heartbeat=setInterval(()=>{try{c.enqueue(encoder.encode(': heartbeat\n\n'))}catch{clearInterval(heartbeat);streams.delete(c)}},15_000); request.signal.addEventListener('abort',()=>{clearInterval(heartbeat);streams.delete(c);try{c.close()}catch{}},{once:true}) }, cancel(){clearInterval(heartbeat);streams.delete(controller)} })
    return new Response(stream, { headers: { 'Content-Type':'text/event-stream', 'Cache-Control':'no-cache, no-transform', Connection:'keep-alive', 'X-Accel-Buffering':'no' } })
  })
  .post('/krathongs', async ({body,request,set,server}) => {
    if(!store.settings().accepting){set.status=409;return {error:'ขณะนี้ปิดรับกระทงชั่วคราว'}}
    const ip=request.headers.get('x-event-client-ip') || server?.requestIP(request)?.address || 'local'
    if(limited(`submit:${ip}`, 120)){set.status=429;return {error:'ส่งกระทงบ่อยเกินไป กรุณารอสักครู่'}}
    const name=clean(body.name); const wish=clean(body.wish)
    if(!name){set.status=422;return {error:'กรุณาใส่ชื่อของคุณ'}}
    // Client-generated request IDs make retries safe after a network interruption.
    const existing = await store.find(body.id)
    if(existing) return existing
    const item={...body,name,wish,createdAt:Date.now(),status:store.settings().moderation?'pending' as const:'approved' as const}
    await store.add(item);await broadcast();set.status=201;return {id:item.id,status:item.status}
  },{body:t.Object({id:t.String({format:'uuid'}),country:t.String({pattern:'^('+countries.map(c=>c.code).join('|')+')$'}),base:t.Integer({minimum:0,maximum:5}),flower:t.Integer({minimum:0,maximum:5}),name:t.String({minLength:1,maxLength:40}),wish:t.String({maxLength:160})})})
  .post('/login', ({body,request,set,server,cookie}) => {
    if(limited(`login:${request.headers.get('x-event-client-ip') || server?.requestIP(request)?.address || 'local'}`,10,300_000)){set.status=429;return {error:'ลองเข้าสู่ระบบมากเกินไป กรุณารอ 5 นาที'}}
    if(body.password!==password){set.status=401;return {error:'รหัสผ่านไม่ถูกต้อง'}}
    const token=crypto.randomUUID();sessions.set(token,Date.now()+12*60*60*1000)
    cookie.admin!.set({value:token,httpOnly:true,sameSite:'strict',secure:process.env.COOKIE_SECURE==='true',path:'/api',maxAge:43200})
    return {ok:true}
  },{body:t.Object({password:t.String({maxLength:200})})})
  .guard({beforeHandle:({cookie,set})=>{if((sessions.get(String(cookie.admin?.value))||0)<Date.now()){set.status=401;return {error:'กรุณาเข้าสู่ระบบ'}}}},app=>app
    .get('/admin/state',async()=>({...await store.state(),krathongs:await store.list(true)}))
    .post('/logout',({cookie})=>{sessions.delete(String(cookie.admin?.value));cookie.admin!.remove();return {ok:true}})
    .patch('/admin/settings',async({body})=>{await store.updateSettings({...defaults,...body,scene:body.scene ?? store.settings().scene});await broadcast();return store.state()}, {body:t.Object({title:t.String({minLength:1,maxLength:80}),subtitle:t.String({maxLength:140}),size:t.Number({minimum:.4,maximum:2}),speed:t.Number({minimum:.1,maximum:3}),sceneSpeed:t.Number({minimum:0,maximum:3}),waterSpeed:t.Number({minimum:.1,maximum:3}),brightness:t.Number({minimum:.3,maximum:1.5}),maxVisible:t.Integer({minimum:1,maximum:100}),showNames:t.Boolean(),showWishes:t.Boolean(),showQr:t.Boolean(),showMemorial:t.Optional(t.Boolean()),scene:t.Optional(sceneSchema),paused:t.Boolean(),accepting:t.Boolean(),moderation:t.Boolean(),guestUrl:t.String({maxLength:300,pattern:'^(https?://[^\\s]+)?$'})})})
    .patch('/admin/krathongs/:id',async({params,body,set})=>{if(!await store.moderate(params.id,body.status)){set.status=404;return {error:'ไม่พบกระทง'}}await broadcast();return {ok:true}},{body:t.Object({status:t.Union([t.Literal('approved'),t.Literal('deleted')])})})
    .delete('/admin/krathongs',async()=>{await store.clear();await broadcast();return {ok:true}})
  )
  .onError(({code,set})=>{if(code==='VALIDATION'){set.status=422;return {error:'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'}}console.error('API error:',code);set.status=500;return {error:'เกิดข้อผิดพลาด กรุณาลองใหม่'}})
export function startServer() { return app.listen({port:Number(process.env.API_PORT||4100),hostname:process.env.API_HOST||'127.0.0.1',idleTimeout:0}) }
