import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/client'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await API.post('/auth/login', credentials)
      localStorage.setItem('token', res.data.token)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Login failed')
    }
  }
)

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.status = 'idle'
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    hydrateFromStorage(state) {
      const token = localStorage.getItem('token')
      const userRaw = localStorage.getItem('user')
      const user = userRaw ? JSON.parse(userRaw) : null
      state.token = token
      state.user = user
      state.isAuthenticated = !!token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || 'Login failed'
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { logout, hydrateFromStorage } = authSlice.actions

export default authSlice.reducer

