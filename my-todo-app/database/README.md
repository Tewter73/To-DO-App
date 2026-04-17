# Database Guide (MariaDB)

โฟลเดอร์นี้เก็บสคริปต์ตั้งต้นฐานข้อมูลของระบบ

- ไฟล์หลัก: `todo_db_init.sql`
- ใช้สำหรับสร้าง schema เริ่มต้นของโปรเจกต์ To-Do

## ขั้นตอนใช้งาน

1. เปิด MariaDB ให้พร้อมใช้งาน
2. สร้างฐานข้อมูลชื่อ `todo_db` (ถ้ายังไม่มี)
3. รันไฟล์ `todo_db_init.sql`
4. ตรวจสอบว่ามีตารางหลักตาม requirement:
   - `user`
   - `activity`

## ตัวอย่างนำเข้า (CLI)

```bash
mysql -u root -p todo_db < todo_db_init.sql
```

## หมายเหตุสำคัญ

- ตารางใช้ชื่อเอกพจน์ตาม requirement อาจารย์
- field รหัสผ่านต้องเป็น Salt + HashedPassword เท่านั้น
- ฝั่ง backend ต้องใช้ connection string ที่ชี้ฐาน `todo_db` เดียวกัน
