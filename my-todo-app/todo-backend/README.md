# Todo Backend (.NET 8 Web API)

Backend สำหรับ Authentication + Activities CRUD

## Tech Stack

- .NET SDK 8
- ASP.NET Core Web API
- EF Core + MariaDB (Pomelo)
- JWT Bearer Auth

## ติดตั้งและรัน

```bash
dotnet restore
dotnet build
dotnet run --urls "http://0.0.0.0:5555"
```

## Endpoint หลัก

- `POST /api/tokens` login และรับ JWT
- `POST /api/users/register` สมัครสมาชิก
- `POST /api/users/reset-password` รีเซ็ตรหัสผ่าน
- `GET/POST/PUT/DELETE /api/activities` จัดการ To-Do (ต้องแนบ JWT)

## การตั้งค่า

- แก้ connection string ในไฟล์ settings ของโปรเจกต์ให้ตรงกับเครื่อง
- พอร์ตแนะนำสำหรับทั้ง Web/Mobile คือ `5555`
- สำหรับ Mobile ให้เรียกผ่าน IP เครื่อง เช่น `http://192.168.1.27:5555`

## เช็กลิสต์ก่อนส่งให้เพื่อน

- Swagger เปิดได้
- `POST /api/tokens` ทำงานและคืน `token` + `firstName`
- `GET /api/activities` เรียงตาม `when` จากเก่าไปใหม่
