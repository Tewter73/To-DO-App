# Todo Mobile (React Native + Expo)

Mobile App ของระบบ To-Do สำหรับทดสอบผ่าน Expo Go บนมือถือจริง

## ติดตั้ง

```bash
npm install
```

## ตั้งค่า API URL (สำคัญมาก)

แก้ไฟล์ `src/api.js`:

- ใช้ IP เครื่องที่รัน backend เช่น `http://192.168.1.27:5555`
- ห้ามใช้ `localhost` สำหรับ mobile

## รันผ่าน Expo Go

```bash
npx expo start --clear --port 8084
```

จากนั้นใช้มือถือจริงเปิด Expo Go แล้วสแกน QR

## ชุดทดสอบ

```bash
npm test -- --runInBand
```

## ฟีเจอร์ที่พร้อมแล้ว

- SignIn / Register / Forgot Password
- Main + Credit + Drawer + Sign Out
- Validation real-time ด้วย `HelperText`
- SecureStore เก็บ token และ firstName

## Prompt สำหรับเพื่อน (ตกแต่ง Mobile ต่อ)

```text
Please improve UI/UX of todo-mobile without breaking current behavior.

Constraints:
1) Keep API contract and endpoint paths unchanged.
2) Keep validation rules in src/utils/validation.js unchanged.
3) Keep Expo-compatible packages only.
4) Keep tests passing: npm test -- --runInBand
5) Keep app runnable in Expo Go on real phone (no emulator requirement).

Tasks:
- Improve spacing, typography, and visual hierarchy on SignIn/Register/Forgot/Main/Credit.
- Improve form ergonomics (focus flow, keyboard handling, safe paddings).
- Keep eye icon password toggle behavior.
- Keep date/time editing flow stable on Android.

After changes:
- Run npm test -- --runInBand
- Provide changed files + manual test checklist for Expo Go.
```

## ปัญหาที่พบบ่อย

- เข้า API ไม่ได้: เช็กว่า phone กับ PC อยู่ network เดียวกัน
- Timeout: เช็ก firewall และพอร์ต backend `5555`
- Login เด้ง error: เช็กว่า backend รันอยู่และ DB เชื่อมต่อสำเร็จ
