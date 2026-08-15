import { api } from './api'

export async function fetchVolunteers(token, { status, source, q } = {}) {
  const response = await api.get('/volunteers', {
    params: {
      ...(status ? { status } : {}),
      ...(source ? { source } : {}),
      ...(q ? { q } : {}),
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function fetchVolunteerById(id, token) {
  const response = await api.get(`/volunteers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function createVolunteerAdmin(payload, token) {
  const response = await api.post('/volunteers/admin', payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateVolunteer(id, payload, token) {
  const response = await api.patch(`/volunteers/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateVolunteerStatus(id, status, token) {
  return updateVolunteer(id, { status }, token)
}

export async function issueVolunteerCard(id, token) {
  const response = await api.patch(
    `/volunteers/${id}/issue-card`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function uploadVolunteerPhoto(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/volunteers/upload', formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function deleteVolunteer(id, token) {
  const response = await api.delete(`/volunteers/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
