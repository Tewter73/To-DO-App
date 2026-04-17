// main.jsx — จุด mount แอป React ลง DOM (#root) และเปิด StrictMode เพื่อช่วยตรวจพฤติกรรมที่ไม่ปลอดภัยในระหว่างพัฒนา
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { CookiesProvider } from 'react-cookie'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </StrictMode>,
)
