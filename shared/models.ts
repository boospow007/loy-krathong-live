import { createDefaultScene, type SceneLayout } from './scene-layout'
import { EVENT_TITLE } from './event-brand'
export const bases = [
  { name: 'กลีบเล็บครุฑ', story: 'กลีบแหลมซ้อนสองชั้นจากใบตองสด', color: '#435d2f', edge: '#92a46c' },
  { name: 'กะลามะพร้าว', story: 'กะลาสีน้ำตาลธรรมชาติรองด้วยใบตอง', color: '#725238', edge: '#b39a70' },
  { name: 'กลีบกุหลาบ', story: 'พับกลีบใบตองเล็กเรียงแน่นเป็นชั้น', color: '#466138', edge: '#a3ae7d' },
  { name: 'กลีบหัวขวาน', story: 'กลีบเฉียงสับหว่างตามงานฝีมือไทย', color: '#3d572d', edge: '#91a571' },
  { name: 'บัวสายใบตอง', story: 'กลีบบัวแผ่รอบฐานหยวกกล้วย', color: '#536637', edge: '#a7b782' },
  { name: 'กลีบพัด', story: 'จับจีบใบตองเป็นพัดเล็กสองชั้น', color: '#425e34', edge: '#97ad77' }
] as const
export const flowers = [
  { name: 'บัวชมพู', story: 'ดอกบัวชมพูอ่อนแซมมะลิขาว', color: '#c69295', inner: '#f0e0d4', kind: 'lotus' },
  { name: 'มะลิขาว', story: 'มะลิตูมสีขาวนวลหอมละมุน', color: '#e1deca', inner: '#f5f1dd', kind: 'jasmine' },
  { name: 'ดาวเรือง', story: 'ดาวเรืองสีเหลืองทองจากกลีบสด', color: '#c69732', inner: '#e5c36b', kind: 'marigold' },
  { name: 'กล้วยไม้ม่วง', story: 'กล้วยไม้หวายม่วงแซมมะลิ', color: '#956185', inner: '#dbc5ce', kind: 'orchid' },
  { name: 'บานไม่รู้โรย', story: 'ดอกเล็กสีม่วงอมชมพูเรียงชิดกัน', color: '#954c75', inner: '#c78ca5', kind: 'amaranth' },
  { name: 'บุปผารวมใจ', story: 'ดาวเรือง มะลิ และบานไม่รู้โรย', color: '#c6a052', inner: '#e7d9b6', kind: 'mixed' }
] as const
export interface Krathong { id: string; country: string; base: number; flower: number; name: string; wish: string; createdAt: number; status: 'approved' | 'pending'; source?: 'admin-random' }
export interface Settings { title: string; subtitle: string; size: number; speed: number; sceneSpeed: number; waterSpeed: number; brightness: number; nameScale: number; wishScale: number; showNames: boolean; showWishes: boolean; showQr: boolean; showBrand: boolean; showHeading: boolean; showCount: boolean; showControls: boolean; showFooter: boolean; showMemorial: boolean; paused: boolean; accepting: boolean; moderation: boolean; guestUrl: string; scene: SceneLayout }
export const defaults: Settings = { title: EVENT_TITLE, subtitle: 'ให้สายน้ำพาคำอธิษฐานของเราไปด้วยกัน', size: 1, speed: 1, sceneSpeed: 1, waterSpeed: 1, brightness: 1, nameScale: 1, wishScale: 1, showNames: true, showWishes: true, showQr: true, showBrand: true, showHeading: true, showCount: true, showControls: true, showFooter: true,  showMemorial: false, paused: false, accepting: true, moderation: false, guestUrl: '', scene: createDefaultScene() }
export interface LiveState { settings: Settings; krathongs: Krathong[]; total: number; revision: number }
