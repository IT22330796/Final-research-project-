import { useContext } from 'react'
import { AuthContext } from './authContextInternal'

export function AuthProvider({ children }) {
  return <>{children}</>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

