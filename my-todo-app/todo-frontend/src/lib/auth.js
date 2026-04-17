import { Cookies } from 'react-cookie'

const TOKEN_KEY = 'todo_token'
const cookies = new Cookies()

export function getAuthToken() {
  return cookies.get(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token) {
  localStorage.removeItem(TOKEN_KEY)
  cookies.set(TOKEN_KEY, token, {
    path: '/',
    sameSite: 'lax',
    maxAge: 60 * 60 * 3,
  })
}

export function clearAuthToken() {
  localStorage.removeItem(TOKEN_KEY)
  cookies.remove(TOKEN_KEY, { path: '/' })
}

export function isAuthed() {
  return Boolean(getAuthToken())
}

