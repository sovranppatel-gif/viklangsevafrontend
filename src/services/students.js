import { api } from './api'

export async function fetchStudents(token, { status, q } = {}) {
  const response = await api.get('/students', {
    params: {
      ...(status ? { status } : {}),
      ...(q ? { q } : {}),
    },
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function fetchStudentById(id, token) {
  const response = await api.get(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function createStudent(payload, token) {
  const response = await api.post('/students', payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function updateStudent(id, payload, token) {
  const response = await api.patch(`/students/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function uploadStudentPhoto(file, token) {
  const formData = new FormData()
  formData.append('image', file)
  const response = await api.post('/students/upload', formData, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}

export async function deleteStudent(id, token) {
  const response = await api.delete(`/students/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
