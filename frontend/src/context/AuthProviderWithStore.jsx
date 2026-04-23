import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hydrateFromStorage, loginThunk, logout as logoutAction } from '../state/authSlice'
import { AuthContext } from './authContextInternal'

export function AuthProviderWithStore({ children }) {
  const dispatch = useDispatch()
  const { isAuthenticated, token, user, status, error } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(hydrateFromStorage())
  }, [dispatch])

  const login = async (email, password) => {
    const resultAction = await dispatch(loginThunk({ email, password }))
    if (loginThunk.rejected.match(resultAction)) {
      const message = resultAction.payload || 'Login failed'
      const err = new Error(message)
      err.data = { message }
      throw err
    }
    return resultAction.payload.user
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout, status, error }}>
      {children}
    </AuthContext.Provider>
  )
}
