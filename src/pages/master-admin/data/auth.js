import { api } from '../../../services/api'

const AUTH_KEY = 'vss_master_admin_auth'
const TOKEN_KEY = 'vss_master_admin_token'
const USER_KEY = 'vss_master_admin_user'

export function setMasterAdminSession(token, user) {
  sessionStorage.setItem(AUTH_KEY, '1')
  if (token) sessionStorage.setItem(TOKEN_KEY, token)
  if (user) sessionStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearMasterAdminSession() {
  sessionStorage.removeItem(AUTH_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}

export function isMasterAdminAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1' && Boolean(sessionStorage.getItem(TOKEN_KEY))
}

export function getMasterAdminToken() {
  return sessionStorage.getItem(TOKEN_KEY)
}

export function getMasterAdminUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY) || 'null')
  } catch {
    return null
  }
}

export async function loginMasterAdmin(email, password) {
  const response = await api.post('/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  })
  return response.data
}

export async function fetchMasterAdminMe(token) {
  const response = await api.get('/auth/me', {
    headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  })
  return response.data
}
