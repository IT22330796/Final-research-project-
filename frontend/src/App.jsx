import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { AuthProviderWithStore } from './context/AuthProviderWithStore'

import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Diagnosis from './pages/Diagnosis'
import Patient from './pages/Patient'
import PatientDetails from './pages/PatientDetails'

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/*"
        element={
          isAuthenticated ? (
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/diagnosis/*" element={<Diagnosis />} />
                <Route path="/diagnose/*" element={<Diagnosis />} />
                <Route path="/patient" element={<Patient />} />
                <Route path="/patient/:id" element={<PatientDetails />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProviderWithStore>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProviderWithStore>
  )
}

export default App
