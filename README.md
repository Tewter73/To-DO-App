# To-Do Application (Final Project)

โปรเจกต์นี้เป็นแอปพลิเคชันจัดการสิ่งที่ต้องทำ (To-Do List) แบบครบวงจร (Full-stack) ที่ประกอบด้วย Database, Backend API, Web App (React) และ Mobile App (React Native/Expo)

## 🏗 โครงสร้างของระบบ (Architecture)

โปรเจกต์ถูกแบ่งออกเป็น 4 ส่วนหลักเพื่อให้แต่ละส่วนทำงานแยกกัน (Decoupled) แต่สื่อสารกันได้อย่างสมบูรณ์:

1. **`my-todo-app/database/` (MariaDB):** เก็บข้อมูลผู้ใช้งาน (User) และกิจกรรม (Activity) โดยรหัสผ่านจะถูกเข้ารหัสแบบ Hashed + Salt เพื่อความปลอดภัย
2. **`my-todo-app/todo-backend/` (.NET 8 Web API):** ทำหน้าที่เป็นศูนย์กลางประมวลผล (Business Logic) ตรวจสอบความถูกต้องของข้อมูล (Validation) และสร้าง JWT Token สำหรับตรวจสอบสิทธิ์ผู้ใช้
3. **`my-todo-app/todo-web/` (React + Vite):** เว็บแอปพลิเคชันที่ใช้งานบนเบราว์เซอร์ ใช้ Material-UI (MUI) ในการตกแต่งหน้าตา และใช้ React Router ในการจัดการหน้าจอ มีการจัดการ State เพื่อให้ UI อัปเดตทันทีโดยไม่ต้องโหลดหน้าเว็บใหม่
4. **`my-todo-app/todo-mobile/` (React Native + Expo):** แอปพลิเคชันบนมือถือที่เขียนด้วย Expo สื่อสารกับ Backend ผ่าน IP Address และเก็บ Token ไว้ในระบบเข้ารหัสของเครื่อง (`expo-secure-store`)

## 🚀 เครื่องมือที่ต้องเตรียม (Prerequisites)

- **Database:** MariaDB (ต้องตั้งค่า `lower_case_table_names=2` ใน my.ini หากใช้ Windows)
- **Backend:** .NET 8 SDK
- **Frontend/Mobile:** Node.js (LTS version)
- **Mobile Testing:** แอป Expo Go บนโทรศัพท์มือถือ (ทั้งมือถือและคอมพิวเตอร์ต้องต่อ Wi-Fi/LAN วงเดียวกัน)

## ⚙️ ขั้นตอนการรันระบบ (Quick Start)

สามารถคัดลอกคำสั่งด้านล่างไปรันใน Terminal ตามลำดับได้เลย:

### 1. นำเข้า Database
เปิดโปรแกรมจัดการฐานข้อมูล (เช่น HeidiSQL) แล้วรันสคริปต์ SQL ที่อยู่ในไฟล์ `my-todo-app/database/todo_db_init.sql`

### 2. รัน Backend API (.NET)
```bash
cd my-todo-app/todo-backend
dotnet run
```
> ระบบจะรันขึ้นมาที่ `http://localhost:5555` อัตโนมัติ (พร้อมรับ Connection จากมือถือหากใช้ 0.0.0.0 หรือรันใน Network)

### 3. รัน Web App (React)
เปิด Terminal ใหม่แล้วรัน:
```bash
cd my-todo-app/todo-web
npm run dev
```
> สามารถเปิดเว็บเบราว์เซอร์ทดสอบได้ที่ `http://localhost:5173`

### 4. รัน Mobile App (Expo)
เปิด Terminal ใหม่แล้วรัน:
```bash
cd my-todo-app/todo-mobile
npx expo start
```
> จากนั้นนำมือถือเปิดแอป Expo Go แล้วสแกน QR Code เพื่อทดสอบแอป (อย่าลืมตรวจสอบว่าไฟล์ `src/api.js` ใช้ IP Address ของคอมพิวเตอร์อยู่)

---

## 🤝 การโคลนโปรเจกต์ไปทำต่อ (Clone & Continue Guide)

สำหรับเพื่อนในทีมหรือผู้ที่ต้องการนำโปรเจกต์ไปพัฒนาต่อ ให้ทำตามขั้นตอนดังนี้:

1. โคลนโปรเจกต์ลงเครื่อง
   ```bash
   git clone <REPOSITORY_URL>
   cd To-DO-App
   ```
2. โหลด Dependencies ให้ฝั่ง Web และ Mobile
   ```bash
   cd my-todo-app/todo-web && npm install
   cd ../todo-mobile && npm install
   cd ../../
   ```
3. นำเข้า Database และทำตามขั้นตอน "การรันระบบ" ด้านบน

---

## 🤖 AI IDE Prompts (สำหรับกู้คืนไฟล์ Environment)

ในกรณีที่คุณใช้ AI IDE (เช่น Cursor, Windsurf) และพบว่าโปรเจกต์รันไม่ได้เพราะขาดไฟล์ที่ถูก Ignore ไว้ (เช่น `.env` หรือตั้งค่าบางอย่างไม่สมบูรณ์) ให้คัดลอก Prompt ด้านล่างนี้ไปสั่ง AI เพื่อให้มันกู้คืนโครงสร้างให้พร้อมรันทันที:

```text
You are my expert full-stack coding assistant. 
I have just cloned this To-Do application project, but it is missing environment files and specific configurations that were excluded from Git. 
Please scan the code in `my-todo-app/todo-backend`, `my-todo-app/todo-web`, and `my-todo-app/todo-mobile` and help me reconstruct the environment so I can run it end-to-end on Windows.

Specifically:
1. Provide the exact structure for `appsettings.json` in `todo-backend` (Must include JWT ValidIssuer="ToDo" and ValidAudience="public", and MariaDB connection string).
2. Check `todo-web/.env` if needed for VITE_API_BASE_URL.
3. Show me how to find my IPv4 address on Windows and how to apply it in `todo-mobile/src/api.js` or `todo-mobile/.env` (EXPO_PUBLIC_API_BASE_URL) so Expo Go can connect to the backend.
4. Verify all package dependencies are installed and suggest the exact commands to start the DB, Backend, Web, and Mobile simultaneously.
```
