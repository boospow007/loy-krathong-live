# คืนจันทร์ · Loy Krathong Live

เว็บลอยกระทงสำหรับงาน event ออกแบบใหม่ด้วย Nuxt 4 + ElysiaJS (Bun) + MongoDB

## เริ่มใช้งาน

ต้องมี Node.js 22.12+ (แนะนำ 22 LTS), Bun และ Docker หรือ MongoDB ที่เข้าถึงได้

```sh
bun install
cp .env.example .env
# แก้ ADMIN_PASSWORD ใน .env เป็นรหัสของผู้จัดงาน
# MongoDB แยกที่พอร์ต 27018 ไม่ชนฐานข้อมูลเดิมที่ 27017
docker compose up -d mongo
bun run dev
```

Bun โหลด `.env` ให้อัตโนมัติ ตัว launcher ส่ง environment ต่อให้ Nuxt ด้วย

| หน้า | URL | หน้าที่ |
| --- | --- | --- |
| แขก | http://localhost:3000/ | เลือกฐาน 6 แบบ → ดอกไม้ 6 แบบ → ชื่อ/ประเทศ/ธง/คำอวยพร |
| จองาน | http://localhost:3000/display | แยก layer ฉากหลัง ภูเขา แม่น้ำ กระทง พร้อมเต็มจอ |
| แอดมิน | http://localhost:3000/admin | ตั้งค่าขึ้นจอทันที ตรวจอนุมัติ/นำกระทงออก |
| QR โต๊ะ | http://localhost:3000/qr | QR จริง พร้อมหน้าพิมพ์ A5 |

หากยังไม่สร้าง `.env` โหมด development ใช้รหัส `loy-local-admin` เท่านั้น โหมด production บังคับกำหนด `ADMIN_PASSWORD` ยาวอย่างน้อย 12 ตัวอักษร

## ใช้ในงาน

1. เปิด `/admin` ตั้งชื่อและข้อความงาน
2. ตั้ง URL สำหรับแขกเป็น HTTPS domain ที่ใช้งานจริง หรือ IP LAN เช่น `http://192.168.1.131:3000/` หากมือถือและเครื่อง server อยู่เครือข่ายเดียวกัน **อย่าใช้ localhost ใน QR สำหรับแขก**
3. ทดลองสแกนจากมือถือ ส่งกระทง และตรวจบน `/display` ก่อนพิมพ์ QR
4. เปิด `/qr` เพื่อพิมพ์วางโต๊ะ แล้วเปิด `/display` บนเครื่องต่อจอ เลือกเต็มจอ
5. ปรับขนาด ความเร็วกระทง ความเร็วฉาก/น้ำ ความสว่าง จำนวนกระทงล่าสุดบนจอ ชื่อ/คำอวยพร/QR ได้จากแอดมิน ทุกจออัปเดตผ่าน SSE
6. เปิด “ตรวจคำอวยพรก่อนขึ้นจอ” หากต้องการคัดกรอง ชื่อและคำอวยพรของรายการรอตรวจจะไม่ออก public API

กระทงที่แสดงเป็นรายการล่าสุดตามจำนวนที่ตั้งไว้ และวนลอยซ้ำ กระทงทั้งหมดเก็บใน MongoDB ไม่มีการลบเมื่อหลุดจากหน้าจอ แอดมินแสดง 500 รายการล่าสุด กระทงตัวอย่างในพรีวิวแอดมินเมื่อยังไม่มีข้อมูลไม่ถูกบันทึกหรือส่งไปจองาน

## Production

```sh
bun run build
NODE_ENV=production COOKIE_SECURE=true bun run start
```

- ตั้ง `MONGODB_URI` ไปยัง MongoDB ที่มี authentication (Atlas ได้), `MONGODB_DATABASE` และ `ADMIN_PASSWORD` ใน environment ของเครื่อง deploy
- ให้ reverse proxy/HTTPS domain เข้า Nuxt พอร์ต 3000; API อยู่ loopback 4100 ผ่าน Nuxt เท่านั้น ไม่เปิดพอร์ต MongoDB หรือ API สู่ Internet
- SSE `/api/events` ต้องปิด buffering และมี read timeout ยาว เช่น Nginx `proxy_buffering off; proxy_read_timeout 3600s;` อย่า cache เส้นทาง `/api/*`
- หากอยู่หลัง reverse proxy ที่เชื่อถือได้และเขียนทับ X-Forwarded-For ให้ตั้ง `TRUST_PROXY=true` เพื่อจำกัดการส่งตาม IP ของแขกแทน IP ของ proxy
- ตัวอย่างนี้รองรับ **Elysia หนึ่ง process ต่อหนึ่งงาน** ซึ่ง broadcast SSE และ cache settings ใน process เดียว การขยายหลาย instance ต้องเพิ่ม pub/sub หรือ MongoDB change streams เพื่อส่ง event ข้ามเครื่อง
- session แอดมินมีอายุ 12 ชั่วโมงและอยู่ใน memory เมื่อ API restart ต้อง login ใหม่ ส่วนกระทงและการตั้งค่ายังคงอยู่ใน MongoDB
- สำรองข้อมูล MongoDB ก่อนเริ่มงาน และทดสอบพร้อมจำนวนเครื่อง/ขนาดจอที่จะใช้จริง ยังไม่ได้ทดสอบโหลดระดับ production
- ฟอนต์มี system fallback หากโหลด Google Fonts ไม่ได้; หากเครือข่ายงานปิด Internet ควร self-host ฟอนต์ไทยก่อนใช้งาน

## ตรวจสอบ

```sh
bun run typecheck
bun run build
# ต้องเปิด MongoDB ก่อน; สร้าง DB ทดสอบชื่อสุ่มและลบทิ้งหลังทดสอบ
bun test
# หรือ TEST_MONGODB_URI=mongodb://... bun test
```

Integration tests ครอบคลุม login/session, validation, persistence, ส่งซ้ำอย่างปลอดภัย, SSE สำหรับกระทง/การตั้งค่า, moderation, ปิดรับ และป้องกัน cross-origin writes

## โครงสร้าง

- `app/` — Nuxt UI ภาษาไทย responsive, SVG กระทงและฉากที่วาดใหม่
- `shared/` — model, ชื่อฐาน/ดอกไม้ 6×6, ประเทศ
- `api/` — Elysia routes, MongoDB store, SSE, admin auth
- `server/api/` — same-origin proxy จาก Nuxt ไป Elysia
- `compose.yaml` — MongoDB local พร้อม named volume

อ้างอิงเอกสาร framework: [Nuxt 4](https://nuxt.com/docs/4.x), [Elysia](https://elysiajs.com), [MongoDB Node driver](https://www.mongodb.com/docs/drivers/node/current/)

## GitHub Actions / production server

Production: https://loy-krathong.168.144.142.139.sslip.io

Push เข้า `main` หรือเลือก **Actions → Test and deploy → Run workflow** เพื่อ deploy อัตโนมัติ Pull request จะรัน checks/build อย่างเดียว

Pipeline ใช้ Node 22 + Bun 1.3.14, MongoDB service สำหรับ tests, typecheck, integration tests, Nuxt build และ bundle API จาก `api/main.ts` จากนั้นส่งเฉพาะ compiled application ผ่าน SSH ที่ตรวจ host key

- Docker Compose project: `loy-krathong-live`
- Host port: **127.0.0.1:4310** (ไม่เปิด port สู่ Internet)
- API: port **4100 ใน Docker network เท่านั้น**
- Public: Nginx virtual host แยกบน **80/443**, HTTPS จาก Let's Encrypt ต่ออายุอัตโนมัติ
- MongoDB Atlas database: **loy_krathong_live** แยกจากโปรเจกต์อื่น
- Server path: `/opt/loy-krathong-live`; compiled releases อยู่ `releases/<commit-sha>` และ `current` ชี้รุ่นที่ผ่าน health check แล้ว
- Runtime secrets: `/opt/loy-krathong-live/shared/runtime.env` mode 600; ไม่มี secrets ใน Git หรือ release archive
- CI SSH key ใน root ถูกจำกัดด้วย `restrict,command=.../deploy-gateway.sh` ใช้ได้เฉพาะ `configure` และ `deploy <sha>` เปิด shell/forwarding ไม่ได้
- รหัสแอดมิน production สุ่มแยกจากรหัส SSH และ development; ดูในไฟล์ `.secrets/production-admin.env` บนเครื่องผู้พัฒนา (ถูก ignore) หรือ server runtime env ผ่านสิทธิ์ root
- Deploy ล้มเหลวระหว่าง health check จะคืน container รุ่นก่อนและ runtime env ก่อนหน้า ไม่ restart container/service ของโปรเจกต์อื่น
- กำหนด memory limit 256 MB ต่อ container และ CPU limit 0.35 ต่อ containerสำหรับเครื่องที่มีหลายงาน
- S3/Spaces credentials เก็บใน Actions secrets และ runtime env พร้อมใช้ ฟีเจอร์ปัจจุบันเป็น SVG จึงยังไม่มีการอัปโหลดไฟล์หรือแก้ไข bucket เดิม

Repository secrets: `DEPLOY_HOST`, `DEPLOY_PORT`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS`, `MONGODB_URI`, `ADMIN_PASSWORD`, `S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_PUBLIC_URL`

ใช้ `loy_krathong_live` ใน MongoDB URI และต้องอนุญาต outbound server IP ใน MongoDB Atlas Network Access หาก cluster จำกัด IP

ตรวจสถานะบน server:

```sh
cd /opt/loy-krathong-live/current
RELEASE_ID=$(basename "$PWD") docker compose -p loy-krathong-live -f deploy/compose.prod.yaml ps
```

DNS ฟรีใช้ [sslip.io](https://sslip.io/) ชี้ hostname ที่ฝัง IP มายัง server โดยไม่ต้องซื้อโดเมน URL นี้ใช้ได้ตราบใดที่ server IP และผู้ให้บริการ DNS ยังทำงาน

## Languages

The UI supports **English (default)** and **Thai**. Use the EN / ไทย switch on the guest page, organizer page, live-display controls, or print toolbar. The choice is remembered for one year in the `khuen-chan-language` cookie and is respected during server rendering; a new visitor always starts in English.

Switching languages does not reset the current krathong, guest name, country or wish. Country names, base/flower names, buttons, validation errors, admin controls, QR cards and page metadata follow the selected language. Guest names and wishes are displayed exactly as submitted. Custom event titles/messages remain as written; only the built-in default event copy is localized.

Translations and country-label formatting live in `shared/i18n.ts`; locale state and cookie handling live in `app/composables/useAppI18n.ts`. The language preference is separate from the shared event settings, so a guest changing their language does not change the language on the event screen.
