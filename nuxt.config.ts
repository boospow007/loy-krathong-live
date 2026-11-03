export default defineNuxtConfig({
  compatibilityDate: '2026-11-01',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css','~/assets/css/gala.css'],
  routeRules: { '/krathongs/natural-v1/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }, '/scene/ayutthaya-v1/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } } },
  runtimeConfig: { apiInternalUrl: 'http://127.0.0.1:4100' },
  app: { head: { title: 'Gala Dinner ASEAN Senior Law Officials Meeting: 25th ASLOM', htmlAttrs: { lang: 'en' }, meta: [{ name: 'description', content: 'Make a wish in the moonlight. Create your krathong and launch it on the live river.' }], link: [{ rel: 'preconnect', href: 'https://fonts.googleapis.com' }, { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }, { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&family=Noto+Serif+Thai:wght@400;500;600&display=swap' }] } }
})
