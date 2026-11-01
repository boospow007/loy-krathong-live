import { defaults, type LiveState } from '#shared/models'
export function useLive() {
  const state = useState<LiveState>('live-state', () => ({settings:{...defaults},krathongs:[],total:0,revision:0}))
  const connected = ref(false)
  const loaded = ref(false)
  let source: EventSource | undefined
  onMounted(() => { source = new EventSource('/api/events'); source.onmessage = (event) => { try { state.value=JSON.parse(event.data);connected.value=true;loaded.value=true } catch {} }; source.onerror=()=>{connected.value=false}; source.onopen=()=>{connected.value=true} })
  onBeforeUnmount(()=>source?.close())
  return { state, connected, loaded }
}
export async function api<T = any>(url:string, options: any = {}):Promise<T> {
  try { return await $fetch<T>(`/api${url}`,options) as T } catch(error:any) { throw new Error(error.data?.error || 'เชื่อมต่อไม่สำเร็จ กรุณาลองอีกครั้ง') }
}
