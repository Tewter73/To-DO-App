import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'

const getApiBaseUrl = () => {
  // Allow explicit override when needed
  if (process.env.EXPO_PUBLIC_API_BASE_URL) {
    return process.env.EXPO_PUBLIC_API_BASE_URL
  }

  // In Expo Go, hostUri usually looks like "192.168.x.x:8081"
  const hostUri =
    Constants?.expoConfig?.hostUri ??
    Constants?.manifest2?.extra?.expoGo?.debuggerHost ??
    Constants?.manifest?.debuggerHost

  const host = hostUri?.split(':')?.[0]
  if (host) {
    return `http://${host}:5555`
  }

  // Last resort for simulator/emulator or manual environments
  return 'http://localhost:5555'
}

const API_BASE_URL = getApiBaseUrl()

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
