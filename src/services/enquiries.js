import { api } from './api'

export async function fetchEnquiries(token, status) {
  const response = await api.get('/enquiries', {
    params: status ? { status } : undefined,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}

export async function updateEnquiryStatus(id, status, token) {
  const response = await api.patch(
    `/enquiries/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

export async function deleteEnquiry(id, token) {
  const response = await api.delete(`/enquiries/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return response.data
}
