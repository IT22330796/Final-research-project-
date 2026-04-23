import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import patientsReducer from './patientsSlice'
import diagnosesReducer from './diagnosesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    diagnoses: diagnosesReducer,
  },
})

