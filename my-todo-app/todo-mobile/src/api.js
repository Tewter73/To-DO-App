import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'

const getApiBaseUrl = () => {
  // 🌟 บังคับใช้ IP Address แทน 127.0.0.1 ตาม Requirement ของอาจารย์
  // ให้ตั้งค่าผ่าน EXPO_PUBLIC_API_BASE_URL ในไฟล์ .env หรือจะแก้บรรทัด fallback ด้านล่างตรงๆ ก็ได้
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL
  }

  // Fallback (เผื่อไม่ได้ตั้ง .env) ให้ยิงไป IP แบบ Hardcoded ตามที่อาจารย์ระบุ
  return 'http://192.168.1.43:5555'
}

const API_BASE_URL = getApiBaseUrl()

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

// =========================================================
// 🌟 การจัดการ Token แบบอัตโนมัติ (Axios Interceptor)
// =========================================================
// ทุกครั้งที่จะยิง API ตัว Interceptor นี้จะไปงัดเอา Token ที่เก็บไว้อย่างปลอดภัยใน SecureStore 
// มายัดใส่ Headers (Authorization: Bearer ...) ให้เองโดยที่เราไม่ต้องเขียนส่งใหม่ทุกหน้า
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

export default api
