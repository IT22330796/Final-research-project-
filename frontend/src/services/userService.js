import API from '../api/client'

export const userService = {
  login: (credentials) => API.post('/auth/login', credentials).then((res) => res.data),
}

