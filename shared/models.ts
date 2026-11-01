export const bases = [
  { name: 'ใบตองแก้ว', story: 'ความเรียบง่ายที่งดงาม', color: '#388466', edge: '#92c58c' },
  { name: 'บัวมรกต', story: 'ผลิบานรับสิ่งดี ๆ', color: '#277f80', edge: '#80d2b2' },
  { name: 'จันทร์สาน', story: 'สานต่อทุกความหวัง', color: '#a77c42', edge: '#e9c887' },
  { name: 'มงกุฎนที', story: 'สง่างามเหนือสายน้ำ', color: '#405b89', edge: '#a6b9dc' },
  { name: 'พิกุลทอง', story: 'เปล่งประกายความสุข', color: '#aa8033', edge: '#f1d27c' },
  { name: 'บัวแสงจันทร์', story: 'อ่อนโยนดั่งแสงจันทร์', color: '#92728e', edge: '#e4bbd3' }
] as const
export const flowers = [
  { name: 'บัวชมพู', story: 'ความสงบในหัวใจ', color: '#e998b0', inner: '#ffe2e3', kind: 'lotus' },
  { name: 'มะลิจันทร์', story: 'รักที่บริสุทธิ์', color: '#e5ecdb', inner: '#fffbed', kind: 'jasmine' },
  { name: 'ดาวเรือง', story: 'รุ่งเรืองและสดใส', color: '#e5a126', inner: '#ffe289', kind: 'marigold' },
  { name: 'กล้วยไม้ม่วง', story: 'มิตรภาพที่ยืนยาว', color: '#b59ad8', inner: '#ecddff', kind: 'orchid' },
  { name: 'กุหลาบราตรี', story: 'ความรักและความปรารถนาดี', color: '#c25877', inner: '#f1a8b6', kind: 'rose' },
  { name: 'บุปผารวมใจ', story: 'ทุกความสุขมารวมกัน', color: '#edbc77', inner: '#fff2d9', kind: 'mixed' }
] as const
export interface Krathong { id: string; country: string; base: number; flower: number; name: string; wish: string; createdAt: number; status: 'approved' | 'pending' }
export interface Settings { title: string; subtitle: string; size: number; speed: number; sceneSpeed: number; waterSpeed: number; brightness: number; maxVisible: number; showNames: boolean; showWishes: boolean; showQr: boolean; paused: boolean; accepting: boolean; moderation: boolean; guestUrl: string }
export const defaults: Settings = { title: 'คืนจันทร์ ริมสายน้ำ', subtitle: 'ให้สายน้ำพาคำอธิษฐานของเราไปด้วยกัน', size: 1, speed: 1, sceneSpeed: 1, waterSpeed: 1, brightness: 1, maxVisible: 36, showNames: true, showWishes: true, showQr: true, paused: false, accepting: true, moderation: false, guestUrl: '' }
export interface LiveState { settings: Settings; krathongs: Krathong[]; total: number; revision: number }
