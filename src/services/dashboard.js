import { api } from './api'

export async function fetchDashboard(token) {
  const response = await api.get('/dashboard', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
