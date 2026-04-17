# Windows Setup Guide For New Teammate

คู่มือสำหรับเพื่อนที่ยังไม่มีเครื่องมือใดๆ แล้วต้องการโคลนและรันโปรเจกต์นี้บนเครื่องตัวเอง

## 1) ติดตั้งโปรแกรมพื้นฐาน

ติดตั้งตามลำดับนี้:

1. Git  
   - Download: https://git-scm.com/download/win
2. Node.js LTS (แนะนำ 20+)  
   - Download: https://nodejs.org/
3. .NET SDK 8  
   - Download: https://dotnet.microsoft.com/en-us/download/dotnet/8.0
4. MariaDB Server  
   - Download: https://mariadb.org/download/
5. (แนะนำ) HeidiSQL สำหรับ import SQL  
   - Download: https://www.heidisql.com/download.php
6. VS Code หรือ Cursor

เช็กหลังติดตั้ง (PowerShell):

```powershell
git --version
node -v
npm -v
dotnet --version
```

## 2) Clone โปรเจกต์

```powershell
git clone <YOUR_GITHUB_REPO_URL>
cd To-DO-App
```

## 3) ตั้ง Database

1. เปิด MariaDB
2. สร้าง DB ชื่อ `todo_db`
3. Import ไฟล์ `my-todo-app/database/todo_db_init.sql`

ตัวอย่าง CLI:

```powershell
mysql -u root -p todo_db < my-todo-app/database/todo_db_init.sql
```

## 4) รัน Backend

```powershell
cd my-todo-app/todo-backend
dotnet restore
dotnet build
dotnet run --urls "http://0.0.0.0:5555"
```

## 5) รัน Web

เปิด terminal ใหม่:

```powershell
cd my-todo-app/todo-web
npm install
npm run dev
```

## 6) รัน Mobile (Expo Go มือถือจริง)

1. ติดตั้ง Expo Go บนมือถือ
2. เช็ก IP เครื่องคอมด้วย `ipconfig`
3. แก้ `my-todo-app/todo-mobile/src/api.js` ให้ `API_BASE_URL` เป็น `http://<your-ip>:5555`

เปิด terminal ใหม่:

```powershell
cd my-todo-app/todo-mobile
npm install
npx expo start --clear --port 8084
```

สแกน QR ด้วย Expo Go

## 7) แยก Branch สำหรับทำงาน

```powershell
git checkout main
git pull
git checkout -b feat/<your-task-name>
```

พอทำเสร็จ:

```powershell
git add .
git commit -m "feat: <short message>"
git push -u origin feat/<your-task-name>
```

แล้วเปิด Pull Request เข้า `main`

## 8) หาก `.gitignore` หายบน GitHub

เช็กว่ามีไฟล์:
- `my-todo-app/.gitignore`
- `my-todo-app/todo-web/.gitignore`
- `my-todo-app/todo-mobile/.gitignore`

ถ้าหาย ให้สร้าง branch แล้ว restore ไฟล์ก่อนทำงานอื่น
