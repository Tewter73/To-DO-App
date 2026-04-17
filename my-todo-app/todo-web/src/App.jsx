/**
 * App.jsx — กำหนดเส้นทาง (routing) และผู้ให้บริการรอบแอป
 * What: ใช้ React Router แยกหน้า Login / Main / Credit และห่อด้วย MUI + dayjs สำหรับตัวเลือกวันที่
 * Why: รวม layout และการป้องกันหน้าที่ต้องล็อกอินไว้ที่เดียว ลดการซ้ำในแต่ละหน้า
 */
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CssBaseline } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import toast from 'react-hot-toast'
import 'dayjs/locale/th'

import { AppShell } from './components/AppShell.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { MainPage } from './pages/MainPage.jsx'
import { CreditPage } from './pages/CreditPage.jsx'
import { RegisterPage } from './pages/RegisterPage.jsx'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage.jsx'
import { isAuthed } from './lib/auth.js'

function RequireAuth({ children }) {
  const location = useLocation()

  if (!isAuthed()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return children
}

function AppRoutes() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleUnauthorized = () => {
      toast.error('Session หมดอายุ กรุณาเข้าสู่ระบบใหม่')
      navigate('/login', { replace: true })
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized)
  }, [navigate])

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
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
  )
}

export default function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="th">
      <BrowserRouter>
        <CssBaseline />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2500,
            success: { style: { background: '#16a34a', color: '#fff' } },
            error: { style: { background: '#dc2626', color: '#fff' } },
          }}
        />

        <AppRoutes />
      </BrowserRouter>
    </LocalizationProvider>
  )
}
