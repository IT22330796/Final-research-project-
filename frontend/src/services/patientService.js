import API from '../api/client'

export const patientService = {
  list: () => API.get('/patients').then((res) => res.data),
  create: (payload) => API.post('/patients', payload).then((res) => res.data),
  listByCreatedUserId: (userId) =>
    API.get(`/patients/created-user-id/${userId}`).then((res) => res.data),
}

