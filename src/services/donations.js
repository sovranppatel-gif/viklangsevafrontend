import { api } from './api'

export async function fetchDonations(token, params = {}) {
  const response = await api.get('/donations', {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function createDonationAdmin(payload, token) {
  const response = await api.post('/donations/admin', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateDonation(id, payload, token) {
  const response = await api.patch(`/donations/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteDonation(id, token) {
  const response = await api.delete(`/donations/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
