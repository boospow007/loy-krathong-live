import { test, expect, beforeAll, afterAll } from 'bun:test'
import { MongoClient } from 'mongodb'
import { defaults } from '../shared/models'
process.env.MONGODB_URI=process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27018'
process.env.MONGODB_DATABASE=`loy_test_${crypto.randomUUID().replaceAll('-','')}`
process.env.ADMIN_PASSWORD='test-only-password-123'
let app:any;let store:any;let cookie=''
async function request(path:string,method='GET',body?:unknown,auth=false){return app.handle(new Request(`http://localhost/api${path}`,{method,headers:{'content-type':'application/json',...(auth?{cookie}:{})},...(body?{body:JSON.stringify(body)}:{})}))}
const boat=()=>({id:crypto.randomUUID(),base:1,flower:3,name:'แขกทดสอบ',wish:'ขอให้มีความสุข',country:'TH'})
beforeAll(async()=>{({app,store}=await import('../api/index'));app.compile()})
afterAll(async()=>{await store.client.db(process.env.MONGODB_DATABASE).dropDatabase();await store.client.close()})
test('admin requires authentication and rejects incorrect passwords',async()=>{expect((await request('/admin/state')).status).toBe(401);expect((await request('/login','POST',{password:'wrong'})).status).toBe(401)})
test('valid login creates an HttpOnly session',async()=>{const r=await request('/login','POST',{password:process.env.ADMIN_PASSWORD});expect(r.status).toBe(200);const h=r.headers.get('set-cookie')!;expect(h.toLowerCase()).toContain('httponly');cookie=h.split(';')[0]!;expect((await request('/admin/state','GET',undefined,true)).status).toBe(200)})
test('validates input, persists in MongoDB and prevents duplicate retries',async()=>{expect((await request('/krathongs','POST',{...boat(),base:9})).status).toBe(422);expect((await request('/krathongs','POST',{...boat(),name:'   '})).status).toBe(422);const b=boat();expect((await request('/krathongs','POST',b)).status).toBe(201);expect((await request('/krathongs','POST',b)).status).toBe(200);expect((await (await request('/state')).json()).total).toBe(1);const client=new MongoClient(process.env.MONGODB_URI!);await client.connect();expect(await client.db(process.env.MONGODB_DATABASE).collection('krathongs').countDocuments({id:b.id})).toBe(1);await client.close()})
test('SSE publishes changes and settings to subscribed screens',async()=>{const stream=await request('/events');expect(stream.headers.get('content-type')).toContain('text/event-stream');const reader=stream.body!.getReader();await reader.read();const next=reader.read();const b=boat();await request('/krathongs','POST',b);const chunk=await next;expect(new TextDecoder().decode(chunk.value)).toContain(b.id);const nextSetting=reader.read();expect((await request('/admin/settings','PATCH',{...defaults,size:1.4},true)).status).toBe(200);expect(new TextDecoder().decode((await nextSetting).value)).toContain('"size":1.4');await reader.cancel()})
test('remembrance switch persists, broadcasts both ways and preserves the river',async()=>{
  const before=await store.state()
  expect(before.settings.showMemorial).toBe(false)
  expect((await request('/admin/settings','PATCH',{...before.settings,showMemorial:true})).status).toBe(401)
  const stream=await request('/events');const reader=stream.body!.getReader();await reader.read()
  for(const showMemorial of [true,false]){
    const next=reader.read()
    const response=await request('/admin/settings','PATCH',{...before.settings,showMemorial},true)
    expect(response.status).toBe(200)
    const state=await response.json()
    expect(state.settings.showMemorial).toBe(showMemorial)
    expect(state.settings.accepting).toBe(before.settings.accepting)
    expect(state.krathongs).toEqual(before.krathongs)
    expect(new TextDecoder().decode((await next).value)).toContain(`"showMemorial":${showMemorial}`)
    const persisted=await store.client.db(process.env.MONGODB_DATABASE).collection('settings').findOne({key:'event'})
    expect(persisted.value.showMemorial).toBe(showMemorial)
    const reconnect=await request('/events');const reconnectReader=reconnect.body!.getReader()
    expect(new TextDecoder().decode((await reconnectReader.read()).value)).toContain(`"showMemorial":${showMemorial}`)
    await reconnectReader.cancel()
  }
  await reader.cancel()
  expect((await request('/admin/settings','PATCH',{...before.settings,showMemorial:'yes'},true)).status).toBe(422)
  const {showMemorial,...legacySettings}=before.settings
  expect((await request('/admin/settings','PATCH',legacySettings,true)).status).toBe(200)
  expect((await store.state()).settings.showMemorial).toBe(false)
})
test('scene layout persists, reaches subscribed displays and survives legacy setting writes',async()=>{
  const scene=structuredClone(defaults.scene)
  scene.elements.moon={...scene.elements.moon,x:58,y:27,width:17,rotation:-12,opacity:.7,z:8}
  scene.elements.prang.visible=false;scene.riverY=61.5
  const stream=await request('/events'),reader=stream.body!.getReader();await reader.read()
  const next=reader.read()
  const response=await request('/admin/settings','PATCH',{...defaults,scene},true)
  expect(response.status).toBe(200)
  expect((await response.json()).settings.scene).toEqual(scene)
  expect(JSON.parse(new TextDecoder().decode((await next).value).split('data: ')[1]!.trim()).settings.scene).toEqual(scene)
  const {createStore}=await import('../api/store')
  const reloaded=await createStore(process.env.MONGODB_URI,process.env.MONGODB_DATABASE)
  try{expect(reloaded.settings().scene).toEqual(scene)}finally{await reloaded.client.close()}
  const {scene:ignored,...legacy}=defaults
  expect((await request('/admin/settings','PATCH',{...legacy,speed:1.2},true)).status).toBe(200)
  expect((await store.state()).settings.scene).toEqual(scene)
  const revision=(await store.state()).revision
  for(const invalid of [{...scene,riverY:0},{...scene,elements:{...scene.elements,moon:{...scene.elements.moon,width:0}}},{...scene,elements:{moon:scene.elements.moon}}]){
    expect((await request('/admin/settings','PATCH',{...defaults,scene:invalid},true)).status).toBe(422)
  }
  expect((await store.state()).revision).toBe(revision)
  await reader.cancel()
  expect((await request('/admin/settings','PATCH',defaults,true)).status).toBe(200)
})
test('Japan and ASEAN selections persist and reach the public display',async()=>{for(const country of ['JP','ASEAN']){const b={...boat(),country};expect((await request('/krathongs','POST',b)).status).toBe(201);const state=await (await request('/state')).json();expect(state.krathongs.find((k:any)=>k.id===b.id)?.country).toBe(country);await request(`/admin/krathongs/${b.id}`,'PATCH',{status:'deleted'},true)}expect((await request('/krathongs','POST',{...boat(),country:'ASEAN_INVALID'})).status).toBe(422)})
test('only admins can send anonymous random krathongs; retries do not duplicate them',async()=>{
  const before=await store.state(),ids=Array.from({length:5},()=>crypto.randomUUID())
  expect((await request('/admin/krathongs/random','POST',{ids})).status).toBe(401)
  for(const invalid of [[],Array.from({length:21},()=>crypto.randomUUID()),['invalid'],[ids[0],ids[0]]])expect((await request('/admin/krathongs/random','POST',{ids:invalid},true)).status).toBe(422)
  await request('/admin/settings','PATCH',{...before.settings,accepting:false,moderation:true},true)
  const stream=await request('/events'),reader=stream.body!.getReader();await reader.read();const next=reader.read()
  const response=await request('/admin/krathongs/random','POST',{ids},true)
  expect(response.status).toBe(201);expect(await response.json()).toEqual({added:5,requested:5})
  const update=JSON.parse(new TextDecoder().decode((await next).value).split('data: ')[1]!.trim())
  for(const id of ids){const item=update.krathongs.find((k:any)=>k.id===id);expect(item).toMatchObject({source:'admin-random',name:'',wish:'',country:'',status:'approved'});expect(item.base).toBeGreaterThanOrEqual(0);expect(item.base).toBeLessThanOrEqual(5);expect(item.flower).toBeGreaterThanOrEqual(0);expect(item.flower).toBeLessThanOrEqual(5)}
  const first=await store.find(ids[0])
  expect(await (await request('/admin/krathongs/random','POST',{ids},true)).json()).toEqual({added:0,requested:5})
  expect((await store.state()).total).toBe(before.total+5);expect(await store.find(ids[0])).toEqual(first)
  await reader.cancel()
  for(const id of ids)await request(`/admin/krathongs/${id}`,'PATCH',{status:'deleted'},true)
  await request('/admin/settings','PATCH',before.settings,true)
})
test('global name and wish sizes validate, persist and broadcast while legacy clients preserve them',async()=>{
  const before=await store.state()
  const stream=await request('/events'),reader=stream.body!.getReader();await reader.read();const next=reader.read()
  expect((await request('/admin/settings','PATCH',{...before.settings,nameScale:2.25,wishScale:1.75},true)).status).toBe(200)
  const update=JSON.parse(new TextDecoder().decode((await next).value).split('data: ')[1]!.trim())
  expect(update.settings).toMatchObject({nameScale:2.25,wishScale:1.75})
  const {nameScale,wishScale,...legacy}=before.settings
  await request('/admin/settings','PATCH',legacy,true)
  expect((await store.state()).settings).toMatchObject({nameScale:2.25,wishScale:1.75})
  const {createStore}=await import('../api/store'),reloaded=await createStore(process.env.MONGODB_URI,process.env.MONGODB_DATABASE)
  try{expect(reloaded.settings()).toMatchObject({nameScale:2.25,wishScale:1.75})}finally{await reloaded.client.close()}
  for(const size of [{nameScale:0},{wishScale:3.1},{nameScale:'large'}])expect((await request('/admin/settings','PATCH',{...before.settings,...size},true)).status).toBe(422)
  await reader.cancel();await request('/admin/settings','PATCH',before.settings,true)
})
test('moderation hides pending wishes until approval; removal broadcasts',async()=>{await request('/admin/settings','PATCH',{...defaults,moderation:true},true);const b=boat();const r=await (await request('/krathongs','POST',b)).json();expect(r.status).toBe('pending');let state=await (await request('/state')).json();expect(state.krathongs.some((k:any)=>k.id===b.id)).toBe(false);await request(`/admin/krathongs/${b.id}`,'PATCH',{status:'approved'},true);state=await (await request('/state')).json();expect(state.krathongs.some((k:any)=>k.id===b.id)).toBe(true);await request(`/admin/krathongs/${b.id}`,'PATCH',{status:'deleted'},true);state=await (await request('/state')).json();expect(state.krathongs.some((k:any)=>k.id===b.id)).toBe(false)})
test('closed event rejects submissions and invalid settings leave state intact',async()=>{await request('/admin/settings','PATCH',{...defaults,accepting:false},true);expect((await request('/krathongs','POST',boat())).status).toBe(409);expect((await request('/admin/settings','PATCH',{...defaults,size:100},true)).status).toBe(422);expect((await (await request('/state')).json()).settings.accepting).toBe(false)})
test('single and bulk deletion remove krathongs from MongoDB and broadcast without changing settings',async()=>{
  const ids=[crypto.randomUUID(),crypto.randomUUID()]
  await request('/admin/krathongs/random','POST',{ids},true)
  expect((await request('/admin/krathongs','DELETE')).status).toBe(401)
  expect((await request(`/admin/krathongs/${ids[0]}`,'PATCH',{status:'deleted'})).status).toBe(401)
  const stream=await request('/events'),reader=stream.body!.getReader();await reader.read();const removed=reader.read()
  expect((await request(`/admin/krathongs/${ids[0]}`,'PATCH',{status:'deleted'},true)).status).toBe(200)
  expect(await store.find(ids[0])).toBeNull()
  expect(new TextDecoder().decode((await removed).value)).not.toContain(ids[0]!)
  const settings=store.settings(),cleared=reader.read()
  expect((await request('/admin/krathongs','DELETE',undefined,true)).status).toBe(200)
  const update=JSON.parse(new TextDecoder().decode((await cleared).value).split('data: ')[1]!.trim())
  expect(update.total).toBe(0);expect(update.krathongs).toEqual([])
  expect(await store.list(true)).toEqual([]);expect(store.settings()).toEqual(settings)
  await reader.cancel()
})
test('all approved krathongs reach display and SSE beyond old limits; legacy limit is ignored',async()=>{
  const before=await store.state(),beforeAdmin=(await store.list(true)).length
  const seeded=Array.from({length:622},(_,i)=>({...boat(),createdAt:Date.now()+i,status:i<620?'approved':'pending'}))
  await store.addMany(seeded)
  try{
    const legacyResponse=await request('/admin/settings','PATCH',{...before.settings,maxVisible:55},true)
    expect(legacyResponse.status).toBe(200)
    const state=await legacyResponse.json()
    expect(state.krathongs.length).toBe(before.krathongs.length+620)
    expect(state.total).toBe(state.krathongs.length)
    expect(state.settings.maxVisible).toBeUndefined()
    expect(state.krathongs.some((b:any)=>b.id===seeded[0]!.id)).toBe(true)
    expect((await (await request('/admin/state','GET',undefined,true)).json()).krathongs.length).toBe(beforeAdmin+622)
    const stream=await request('/events'),reader=stream.body!.getReader()
    const payload=JSON.parse(new TextDecoder().decode((await reader.read()).value).split('data: ')[1]!)
    expect(payload.krathongs.length).toBe(state.krathongs.length)
    expect(payload.krathongs.some((b:any)=>b.id===seeded[621]!.id)).toBe(false)
    await reader.cancel()
  }finally{
    await store.client.db(process.env.MONGODB_DATABASE).collection('krathongs').deleteMany({id:{$in:seeded.map(b=>b.id)}})
    await request('/admin/settings','PATCH',before.settings,true)
  }
})
test('display overlay switches persist and broadcast, and older clients preserve them',async()=>{
  const before=await store.state()
  const keys=['showBrand','showHeading','showCount','showControls','showFooter'] as const
  const hidden={...before.settings,showQr:false,...Object.fromEntries(keys.map(key=>[key,false]))}
  expect((await request('/admin/settings','PATCH',hidden)).status).toBe(401)
  const stream=await request('/events'),reader=stream.body!.getReader();await reader.read()
  const next=reader.read()
  expect((await request('/admin/settings','PATCH',hidden,true)).status).toBe(200)
  const update=JSON.parse(new TextDecoder().decode((await next).value).split('data: ')[1]!)
  for(const key of [...keys,'showQr'])expect(update.settings[key]).toBe(false)
  const persisted=await store.client.db(process.env.MONGODB_DATABASE).collection('settings').findOne({key:'event'})
  for(const key of keys)expect(persisted.value[key]).toBe(false)
  const legacy={...hidden};for(const key of keys)delete legacy[key]
  expect((await request('/admin/settings','PATCH',legacy,true)).status).toBe(200)
  for(const key of keys)expect((await store.state()).settings[key]).toBe(false)
  expect((await request('/admin/settings','PATCH',{...hidden,showControls:'no'},true)).status).toBe(422)
  await reader.cancel()
  expect((await request('/admin/settings','PATCH',before.settings,true)).status).toBe(200)
})
test('cross-origin writes are denied and logout revokes access',async()=>{const r=await app.handle(new Request('http://localhost/api/login',{method:'POST',headers:{origin:'https://untrusted.example','content-type':'application/json'},body:JSON.stringify({password:process.env.ADMIN_PASSWORD})}));expect(r.status).toBe(403);await request('/logout','POST',undefined,true);expect((await request('/admin/state','GET',undefined,true)).status).toBe(401)})
