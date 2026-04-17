import { Cookies } from 'react-cookie'

const TOKEN_KEY = 'todo_token'
const FIRST_NAME_KEY = 'firstName'
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
  localStorage.removeItem(FIRST_NAME_KEY)
  cookies.remove(TOKEN_KEY, { path: '/' })
}

export function isAuthed() {
  return Boolean(getAuthToken())
}

export function setFirstName(firstName) {
  if (!firstName) {
    localStorage.removeItem(FIRST_NAME_KEY)
    return
  }

  localStorage.setItem(FIRST_NAME_KEY, firstName)
}

export function getFirstName() {
  return localStorage.getItem(FIRST_NAME_KEY) ?? ''
}

