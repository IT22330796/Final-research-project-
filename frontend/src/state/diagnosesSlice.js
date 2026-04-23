import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import API from '../api/client'

export const fetchDiagnosesThunk = createAsyncThunk(
  'diagnoses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await API.get('/diagnoses')
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to load diagnoses')
    }
  }
)

export const createDiagnosisThunk = createAsyncThunk(
  'diagnoses/create',
  async (payload, { rejectWithValue }) => {
    try {
      const formData = new FormData()

      if (payload.imageFile) {
        formData.append('image', payload.imageFile)
      }

      if (payload.patientId) {
        formData.append('patient', payload.patientId)
      }

      formData.append('disease', payload.disease)
      formData.append('diagnosis', payload.diagnosis)
      formData.append('eye', payload.eye || 'LEFT')
      if (payload.confidence !== undefined && payload.confidence !== null) {
        formData.append('confidence', String(payload.confidence))
      }
      formData.append('status', payload.status || 'Checked')
      formData.append('prescribedMedicine', payload.prescribedMedicine || '')
      formData.append(
        'recommendedTests',
        JSON.stringify(payload.recommendedTests || [])
      )
      formData.append('clinicalNotes', payload.clinicalNotes || '')

      const res = await API.post('/diagnoses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    } catch (err) {
      return rejectWithValue(err?.response?.data || 'Failed to save diagnosis')
    }
  }
)

export const deleteDiagnosisThunk = createAsyncThunk(
  'diagnoses/delete',
  async (id, { rejectWithValue }) => {
    try {
      await API.delete(`/diagnoses/${id}`)
      return id
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message || 'Failed to delete diagnosis')
    }
  }
)

const diagnosesSlice = createSlice({
  name: 'diagnoses',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiagnosesThunk.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchDiagnosesThunk.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchDiagnosesThunk.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createDiagnosisThunk.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createDiagnosisThunk.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteDiagnosisThunk.fulfilled, (state, action) => {
        const id = action.payload
        state.items = state.items.filter((d) => d?._id !== id && d?.id !== id)
      })
      .addCase(deleteDiagnosisThunk.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export default diagnosesSlice.reducer

