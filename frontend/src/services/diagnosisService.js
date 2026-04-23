import API from '../api/client'

export const diagnosisService = {
  list: () => API.get('/diagnoses').then((res) => res.data),
  create: (payload) => API.post('/diagnoses', payload).then((res) => res.data),
}

