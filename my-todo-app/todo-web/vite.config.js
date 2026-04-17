import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// การตั้งค่า Vite: ใช้ปลั๊กอิน React (Fast Refresh) — ปรับพอร์ตหรือ proxy ได้ที่นี่เมื่อเชื่อม backend
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
