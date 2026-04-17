# Todo Web (React + Vite + MUI)

Frontend เว็บของระบบ To-Do

## ติดตั้ง

```bash
npm install
```

## รัน

```bash
npm run dev
```

## ชุดทดสอบ

```bash
npm run test:unit
npm run test:e2e
npm run build
```

## ฟีเจอร์ที่พร้อมแล้ว

- Login / Register / Forgot Password
- Main page (Add/Edit/Delete activity)
- Credit page
- Client-side validation แบบ real-time
- Toast feedback

## Validation Unit Tests

ไฟล์: `tests/unit/validation.test.js`  
ทดสอบฟังก์ชันใน `src/utils/validation.js`

## Playwright E2E

ไฟล์: `tests/todo-app.spec.js`  
Config: `playwright.config.js`

## Prompt สำหรับเพื่อน (ตกแต่ง Web ต่อ)

```text
Please improve UI/UX of todo-web without breaking existing tests.

Constraints:
1) Keep validation rules in src/utils/validation.js unchanged.
2) Keep all existing routes and API contract unchanged.
3) Keep Playwright tests passing (npm run test:e2e).
4) Use MUI components only, no raw HTML styling hacks.

Tasks:
- Improve layout spacing and typography for login/register/forgot/main/credit.
- Add loading skeletons where appropriate.
- Improve mobile responsive behavior for cards and dialogs.
- Preserve Thai text and 24-hour datetime format.

After changes:
- Run npm run test:unit
- Run npm run test:e2e
- Run npm run build
- Return summary + changed files + screenshots checklist.
```
