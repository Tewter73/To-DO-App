# My To-Do App Workspace

โฟลเดอร์รวมงานทั้งหมดของระบบ To-Do (DB + Backend + Web + Mobile)

## โฟลเดอร์ย่อย

- `database/` สคริปต์ฐานข้อมูลเริ่มต้น
- `todo-backend/` ASP.NET Core Web API
- `todo-web/` React Web App
- `todo-mobile/` React Native Mobile App (Expo)

## ลำดับรันระบบบนเครื่อง Local

1. Import SQL จาก `database/todo_db_init.sql`
2. รัน backend (`todo-backend`) ที่ `http://0.0.0.0:5555`
3. รัน web (`todo-web`) และทดสอบหน้า `/login`, `/main`, `/credit`
4. รัน mobile (`todo-mobile`) ผ่าน Expo Go มือถือจริง และตั้ง `src/api.js` เป็น IP เครื่อง backend

## Team Workflow แนะนำ

- ห้ามทำงานตรงบน `main`
- ให้แตก branch ต่อหัวข้อ
- เปิด PR พร้อม checklist ทดสอบก่อน merge

ตัวอย่าง:

```bash
git checkout main
git pull
git checkout -b feat/mobile-credit-polish
```

## Prompt Template สำหรับเพื่อนใช้กับ AI IDE

คัดลอก prompt นี้ไปสั่ง AI IDE ในโปรเจกต์:

```text
You are my coding assistant in this repository.
Goal: make this project runnable end-to-end on my local machine (database, backend, web, mobile).

Please do the following:
1) Inspect README files in root, my-todo-app, database, todo-backend, todo-web, todo-mobile.
2) Verify environment setup for Windows: .NET 8 SDK, Node.js LTS, Git, MariaDB.
3) Verify API URL in todo-mobile/src/api.js uses my LAN IP (not localhost).
4) Run/install commands safely:
   - todo-web: npm install, npm run test:unit, npm run test:e2e, npm run build
   - todo-mobile: npm install, npm test -- --runInBand
   - todo-backend: dotnet restore, dotnet build
5) Report all failures with exact fix steps.
6) Do not commit anything automatically. Ask before commit.

Return:
- A checklist of what passed/failed
- Exact commands I should run next
- Any files that need manual edits (with reasons)
```
