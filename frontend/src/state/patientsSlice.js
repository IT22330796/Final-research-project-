import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/client'

export const fetchPatientsThunk = createAsyncThunk(
  'patients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/patients')
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to load patients')
    }
  }
)

export const createPatientThunk = createAsyncThunk(
  'patients/create',
  async (patient, { rejectWithValue }) => {
    try {
      const res = await API.post('/patients', patient)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data || 'Failed to create patient')
    }
  }
)

export const updatePatientThunk = createAsyncThunk(
  'patients/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await API.put(`/patients/${id}`, updates)
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to update patient')
    }
  }
)

const patientsSlice = createSlice({
  name: 'patients',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatientsThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchPatientsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchPatientsThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createPatientThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createPatientThunk.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updatePatientThunk.fulfilled, (state, action) => {
        const updated = action.payload
        const idx = state.items.findIndex((p) => (p?._id || p?.id) === (updated?._id || updated?.id))
        if (idx !== -1) {
          state.items[idx] = updated
        }
      })
      .addCase(updatePatientThunk.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default patientsSlice.reducer
