import axios from 'axios'
import * as SecureStore from 'expo-secure-store'

// =========================================================
// WARNING: DO NOT USE localhost FOR MOBILE API BASE URL.
// Use your machine LAN IP instead, e.g. http://192.168.x.x:5555
// =========================================================
const API_BASE_URL = 'http://192.168.1.27:5555'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
})

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
