export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  runtimeConfig: { apiInternalUrl: 'http://127.0.0.1:4100' },
  app: { head: { title: 'คืนจันทร์ • ลอยกระทงออนไลน์', htmlAttrs: { lang: 'th' }, meta: [{ name: 'description', content: 'ฝากคำอธิษฐานไปกับสายน้ำ สร้างกระทงของคุณแล้วลอยขึ้นจอพร้อมกัน' }], link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Serif+Thai:wght@400;500;600&display=swap' }] } }
})
