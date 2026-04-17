import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from './api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('authToken'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      api.setAuthToken(token)
      fetchCurrentUser()
    } else {
      setLoading(false)
    }
  }, [token])

  async function fetchCurrentUser() {
    try {
      const response = await api.getCurrentUser()
      setUser(response.data)
    } catch (error) {
      logout()
    } finally {
      setLoading(false)
    }
  }

  async function login(email, password) {
    const response = await api.login(email, password)
    const authToken = response.data.access_token
    localStorage.setItem('authToken', authToken)
    api.setAuthToken(authToken)
    setToken(authToken)
    await fetchCurrentUser()
    navigate('/app/dashboard')
  }

  async function register(email, password) {
    await api.register(email, password)
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem('authToken')
    api.clearAuthToken()
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const value = {
    token,
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
