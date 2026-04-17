# To-DO-App Monorepo Guide

เอกสารหลักสำหรับทีม เพื่อเปิดโปรเจกต์นี้บนเครื่องใหม่, ทำงานแบบแยก branch, และส่งต่อให้เพื่อนทำต่อได้ทันที

## โครงสร้างโปรเจกต์

```text
To-DO-App/
├─ my-todo-app/
│  ├─ database/      # SQL init script
│  ├─ todo-backend/  # ASP.NET Core 8 Web API
│  ├─ todo-web/      # React + Vite + MUI (Web)
│  └─ todo-mobile/   # React Native + Expo (Mobile)
└─ .github/workflows/ci.yml
```

## README แยกโฟลเดอร์

- `my-todo-app/README.md`
- `my-todo-app/database/README.md`
- `my-todo-app/todo-backend/README.md`
- `my-todo-app/todo-web/README.md`
- `my-todo-app/todo-mobile/README.md`
- `SETUP_FOR_FRIEND_WINDOWS.md` (คู่มือเครื่องใหม่แบบไม่มีเครื่องมือมาก่อน)

## Quick Start (สำหรับเครื่องที่มีเครื่องมือครบแล้ว)

1. รัน DB แล้ว import `my-todo-app/database/todo_db_init.sql`
2. รัน backend:
   - `cd my-todo-app/todo-backend`
   - `dotnet run --urls "http://0.0.0.0:5555"`
3. รัน web:
   - `cd my-todo-app/todo-web`
   - `npm install`
   - `npm run dev`
4. รัน mobile:
   - `cd my-todo-app/todo-mobile`
   - `npm install`
   - แก้ `src/api.js` ให้เป็น IP เครื่องที่รัน backend
   - `npx expo start --clear --port 8084`
   - ใช้ Expo Go ในมือถือจริงสแกน QR

## กรณี `.gitignore` หายจาก GitHub

โปรเจกต์นี้ต้องมีไฟล์เหล่านี้:
- `my-todo-app/.gitignore`
- `my-todo-app/todo-web/.gitignore`
- `my-todo-app/todo-mobile/.gitignore`

ถ้าหาย ให้รัน:

```bash
git checkout main
git pull
git checkout -b chore/restore-gitignore
git add my-todo-app/.gitignore my-todo-app/todo-web/.gitignore my-todo-app/todo-mobile/.gitignore
git commit -m "restore missing gitignore files"
git push -u origin chore/restore-gitignore
```

แล้วเปิด PR เข้า `main`

## การทำงานแบบแยก Branch สำหรับเพื่อน

ใช้แนวทางนี้เพื่อลดการชนกันของงาน:

1. สร้าง branch จาก `main` เสมอ
2. 1 branch = 1 เป้าหมายชัดเจน
3. เปิด PR พร้อมรายการทดสอบก่อน merge

ตัวอย่าง branch name:
- `feat/web-ui-polish`
- `feat/mobile-ui-polish`
- `fix/mobile-auth-flow`
- `chore/readme-update`

คำสั่งมาตรฐาน:

```bash
git checkout main
git pull
git checkout -b feat/web-ui-polish
# ทำงาน + commit
git push -u origin feat/web-ui-polish
```

## CI ที่เปิดใช้งานแล้ว

ไฟล์: `.github/workflows/ci.yml`

รันอัตโนมัติบน `push` และ `pull_request`:
- Web unit tests
- Web Playwright E2E
- Mobile Jest tests
