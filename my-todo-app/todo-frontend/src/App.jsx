/**
 * App.jsx — กำหนดเส้นทาง (routing) และผู้ให้บริการรอบแอป
 * What: ใช้ React Router แยกหน้า Login / Main / Credit และห่อด้วย MUI + dayjs สำหรับตัวเลือกวันที่
 * Why: รวม layout และการป้องกันหน้าที่ต้องล็อกอินไว้ที่เดียว ลดการซ้ำในแต่ละหน้า
 */
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

import { AppShell } from './components/AppShell.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { MainPage } from './pages/MainPage.jsx'
import { CreditPage } from './pages/CreditPage.jsx'

// สถานะล็อกอินแบบ mock: เก็บ flag ใน localStorage (ยังไม่เชื่อม API จริงในขั้นตอนนี้)
function isAuthed() {
  return localStorage.getItem('todo_authed') === '1'
}

// ถ้ายังไม่ล็อกอิน ให้ redirect ไป /login และเก็บ path เดิมไว้ใน state (ขยายต่อได้เมื่อเชื่อม JWT)
function RequireAuth({ children }) {
  const location = useLocation()

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <CssBaseline />
        <Toaster position="top-right" />

        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/main"
              element={
                <RequireAuth>
                  <MainPage />
                </RequireAuth>
              }
            />
            <Route
              path="/credit"
              element={
                <RequireAuth>
                  <CreditPage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  )
}
