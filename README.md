# 📋 To-Do App — แอปพลิเคชันจัดการงาน (Full Stack)

> เอกสารนี้ใช้สำหรับการนำเสนอโปรเจกต์ต่ออาจารย์ และเป็นคู่มือให้สมาชิกในทีมติดตั้งและรันโปรเจกต์บนเครื่องตนเองได้อย่างเป็นลำดับขั้น

---

## 📌 เกี่ยวกับโปรเจกต์ (Overview)

โปรเจกต์นี้เป็น **แอปพลิเคชัน To-Do** แบ่งเป็น **สองส่วนหลัก**:

| ส่วน | เทคโนโลยี | บทบาท |
|------|------------|--------|
| **Frontend** | React 19 + Vite 8 + Material UI (MUI) | หน้าเว็บสำหรับเข้าสู่ระบบ แสดงรายการงาน (Mockup) เมนูนำทาง และหน้า Credit |
| **Backend** | ASP.NET Core 8 Web API + Entity Framework Core + MariaDB/MySQL | REST API สำหรับลงทะเบียน ออก JWT และจัดการกิจกรรม (Activities) ต่อผู้ใช้ |

> **หมายเหตุ:** ฝั่งหน้าเว็บในปัจจุบันยังใช้ข้อมูลตัวอย่างใน state เป็นส่วนใหญ่ การเชื่อมต่อ API จริงสามารถต่อยอดจากค่า `VITE_API_BASE_URL` ในไฟล์ `.env` ได้

---

## 🛠️ สิ่งที่ต้องเตรียมพร้อม (Prerequisites)

ก่อนเริ่มงาน ติดตั้งเครื่องมือต่อไปนี้ให้ครบ:

| โปรแกรม | คำแนะนำเวอร์ชัน | หมายเหตุ |
|---------|-----------------|----------|
| **Node.js** | **LTS** (แนะนำ v20 หรือ v22) | ใช้รัน `npm` ฝั่ง Frontend ([ดาวน์โหลด Node.js](https://nodejs.org/)) |
| **.NET SDK** | **8.0** ขึ้นไป | ใช้รัน Backend (`dotnet --version` ควรแสดง 8.x) |
| **MariaDB** | เวอร์ชันที่รองรับ MySQL protocol | ใช้เป็นฐานข้อมูลหลักของ API |
| **เครื่องมือจัดการฐานข้อมูล** | **HeidiSQL**, DBeaver หรือ MySQL Workbench | ใช้สร้างฐานข้อมูล / นำเข้าไฟล์ `.sql` |

> **เคล็ดลับ:** หลังติดตั้ง MariaDB ให้จด **รหัสผู้ใช้** (มักเป็น `root`) และ **รหัสผ่าน** ไว้ใช้ใน `appsettings.json` ของ Backend

---

## 📦 เวอร์ชันแพ็กเกจหลัก (อ้างอิงจากโปรเจกต์)

### Frontend — `todo-frontend/package.json`

**Dependencies**

| แพ็กเกจ | เวอร์ชันในไฟล์ |
|---------|----------------|
| `react` | `^19.2.4` |
| `react-dom` | `^19.2.4` |
| `react-router-dom` | `^7.13.2` |
| `@mui/material` | `^7.3.9` |
| `@mui/icons-material` | `^7.3.9` |
| `@mui/x-date-pickers` | `^8.27.2` |
| `@emotion/react` | `^11.14.0` |
| `@emotion/styled` | `^11.14.1` |
| `dayjs` | `^1.11.20` |
| `react-hot-toast` | `^2.6.0` |

**DevDependencies**

| แพ็กเกจ | เวอร์ชันในไฟล์ |
|---------|----------------|
| `vite` | `^8.0.1` |
| `@vitejs/plugin-react` | `^6.0.1` |
| `eslint` | `^9.39.4` |
| `@eslint/js` | `^9.39.4` |
| `eslint-plugin-react-hooks` | `^7.0.1` |
| `eslint-plugin-react-refresh` | `^0.5.2` |
| `globals` | `^17.4.0` |
| `@types/react` | `^19.2.14` |
| `@types/react-dom` | `^19.2.3` |

### Backend — `todo-backend/TodoBackend.csproj` (NuGet)

> ฝั่ง Backend ใช้ **.NET** ไม่มีไฟล์ `package.json` ชื่อแพ็กเกจและเวอร์ชันอยู่ในไฟล์โปรเจกต์ดังนี้

| แพ็กเกจ (NuGet) | เวอร์ชัน |
|-----------------|----------|
| `Microsoft.AspNetCore.OpenApi` | `8.0.25` |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | `8.0.25` |
| `Microsoft.EntityFrameworkCore.Design` | `8.0.10` |
| `Pomelo.EntityFrameworkCore.MySql` | `8.0.2` |
| `Swashbuckle.AspNetCore` | `6.6.2` |

**Target framework:** `net8.0`

---

## 📥 ขั้นตอนการติดตั้ง (Installation)

### 1) โคลนหรือดาวน์โหลดโปรเจกต์

เปิดเทอร์มินัลแล้วเข้าไปยังโฟลเดอร์โปรเจกต์หลัก:

```bash
cd my-todo-app
```

### 2) ติดตั้งแพ็กเกจ Frontend

```bash
cd todo-frontend
npm install
cd ..
```

### 3) ติดตั้ง / Restore ฝั่ง Backend

โปรเจกต์ .NET ดึงแพ็กเกจ NuGet อัตโนมัติเมื่อ build:

```bash
cd todo-backend
dotnet restore
cd ..
```

---

## 🔐 การตั้งค่า Environment (.env)

### ฝั่ง Frontend (Vite)

1. ไปที่โฟลเดอร์ `todo-frontend`
2. **คัดลอก** ไฟล์ `.env.example` ไปเป็นไฟล์ชื่อ `.env` (อย่า commit ไฟล์ `.env` ขึ้น Git)
3. แก้ค่าตามเครื่องของคุณ:

| ตัวแปร | ความหมาย |
|--------|----------|
| `VITE_API_BASE_URL` | ที่อยู่ฐานของ Web API **ไม่มี** `/` ปิดท้าย — ค่าเริ่มต้น `http://localhost:5102` ให้ตรงกับพอร์ตที่ Backend ใช้ (ดู `Properties/launchSettings.json` profile `http`) |

> **หมายเหตุ:** โค้ดปัจจุบันอาจยังไม่ได้อ่านตัวแปรนี้ในทุกจุด — การตั้งค่าไว้ก่อนช่วยเมื่อเชื่อม API จริง

### ฝั่ง Backend

โปรเจกต์นี้ใช้ **`appsettings.json`** (ไม่ใช้ไฟล์ `.env` แบบ Node)

แก้ไขที่ `todo-backend/appsettings.json`:

| ส่วน | สิ่งที่ต้องปรับ |
|------|------------------|
| `ConnectionStrings:TodoDb` | ให้ `server`, `database`, `user`, `password` ตรงกับ MariaDB บนเครื่อง |
| `Jwt:Key` | ตั้งเป็น **สตริงลับยาวๆ** (อย่างน้อย 32 ตัวอักษร) — **ห้าม** ใช้ค่า `CHANGE_ME_...` ในการส่งงานจริง |
| `Jwt:Issuer` / `Jwt:Audience` | ปกติใช้ค่าเดิมได้ถ้า Frontend เรียก API เครื่องเดียวกัน |

> **ความปลอดภัย:** อย่า commit รหัสผ่านฐานข้อมูลหรือ JWT secret จริงลงที่สาธารณะ — ใช้ User Secrets หรือตัวแปรสภาพแวดล้อมบนเซิร์ฟเวอร์จริง

---

## 🗄️ การตั้งค่าฐานข้อมูล (Database Setup)

### ขั้นตอนที่ 1 — ให้ MariaDB ทำงาน

เปิดบริการ MariaDB บนเครื่อง (Windows: Services / XAMPP / ฯลฯ)

### ขั้นตอนที่ 2 — นำเข้าไฟล์ SQL

โปรเจกต์มีไฟล์เริ่มต้นที่:

`database/todo_db_init.sql`

**ตัวอย่างด้วย HeidiSQL:**

1. เปิด HeidiSQL → สร้างการเชื่อมต่อไปยัง `localhost` ด้วย user/password ที่ใช้จริง
2. เมนู **File → Load SQL file…** เลือก `todo_db_init.sql`
3. รันสคริปต์ (F9 หรือปุ่ม Execute)
4. ตรวจสอบว่ามีฐานข้อมูล **`todo_db`** และตาราง **`user`**, **`activity`**

> หากรหัสผ่าน root ไม่ตรงกับใน `appsettings.json` ให้แก้ `ConnectionStrings:TodoDb` ให้ตรงก่อนรัน Backend

---

## ▶️ การรันโปรเจกต์ (Running the App)

ต้องเปิด **สองเทอร์มินัล** (หรือสองแท็บ) — หนึ่งสำหรับ Backend หนึ่งสำหรับ Frontend

### Backend (ASP.NET Core)

```bash
cd todo-backend
dotnet run
```

- โดยปกติ API จะฟังที่ **`http://localhost:5102`** (ดู `launchSettings.json`)
- ในโหมด Development เปิด **Swagger UI** ตาม URL ที่คอนโซลแสดง (มักเป็น `http://localhost:5102/swagger`)

### Frontend (Vite)

```bash
cd todo-frontend
npm run dev
```

- เปิดเบราว์เซอร์ตาม URL ที่ Vite แสดง (มักเป็น **`http://localhost:5173`**)

### ลำดับที่แนะนำ

1. เปิด MariaDB และยืนยันว่ามีฐาน `todo_db` แล้ว  
2. รัน **Backend** ก่อน  
3. รัน **Frontend**  
4. ทดสอบ API ผ่าน Swagger หรือใช้แอปหน้าเว็บตาม flow ของทีม

---

## 📚 สรุปคำสั่งที่ใช้บ่อย

| งาน | คำสั่ง |
|-----|--------|
| ติดตั้งแพ็กเกจ Frontend | `cd todo-frontend && npm install` |
| รัน Frontend (dev) | `cd todo-frontend && npm run dev` |
| Build Frontend | `cd todo-frontend && npm run build` |
| Restore / Build Backend | `cd todo-backend && dotnet restore && dotnet build` |
| รัน Backend | `cd todo-backend && dotnet run` |

---

> **ส่งงาน / นำเสนอ:** แนะนำให้แนบภาพหน้าจอ Swagger, หน้าเว็บที่รันสำเร็จ และอธิบายบทบาทของแต่ละฝั่งตามเอกสารนี้
