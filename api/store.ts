import { MongoClient } from 'mongodb'
import { defaults, type Settings, type Krathong } from '../shared/models'
import { resolveSceneLayout } from '../shared/scene-layout'
export async function createStore(uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017', name = process.env.MONGODB_DATABASE || 'loy_krathong') {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 })
  await client.connect()
  const db = client.db(name)
  const items = db.collection<Krathong>('krathongs')
  const config = db.collection<{ key: string; value: Settings }>('settings')
  await Promise.all([items.createIndex({ id: 1 }, { unique: true }), items.createIndex({ status: 1, createdAt: -1 }), config.createIndex({ key: 1 }, { unique: true })])
  let revision = 0
  let cached: Settings = { ...defaults, guestUrl: process.env.PUBLIC_ORIGIN || defaults.guestUrl, ...(await config.findOne({key:'event'}))?.value }
  cached.scene = resolveSceneLayout(cached.scene)
  const settings = () => structuredClone(cached)
  const list = (admin=false) => items.find(admin ? {} : {status:'approved'}, {projection:{_id:0}}).sort({createdAt:-1}).limit(500).toArray()
  const state = async () => ({settings:settings(),krathongs:await items.find({status:'approved'},{projection:{_id:0}}).sort({createdAt:-1}).limit(cached.maxVisible).toArray(),total:await items.countDocuments({status:'approved'}),revision})
  return {client,settings,list,state,
    find:(id:string)=>items.findOne({id},{projection:{_id:0}}),
    async updateSettings(value:Settings){const next={...value,scene:resolveSceneLayout(value.scene)};await config.updateOne({key:'event'},{$set:{value:next}},{upsert:true});cached=structuredClone(next);revision++},
    async add(item:Krathong){ const result=await items.updateOne({id:item.id},{$setOnInsert:item},{upsert:true}); if(result.upsertedCount)revision++ },
    async addMany(boats:Krathong[]){const result=await items.bulkWrite(boats.map(item=>({updateOne:{filter:{id:item.id},update:{$setOnInsert:item},upsert:true}})),{ordered:false});if(result.upsertedCount)revision++;return result.upsertedCount},
    async moderate(id:string,status:'approved'|'deleted'){const n=status==='deleted'?(await items.deleteOne({id})).deletedCount:(await items.updateOne({id},{$set:{status}})).matchedCount;if(n)revision++;return n},
    async clear(){await items.deleteMany({});revision++}
  }
}
