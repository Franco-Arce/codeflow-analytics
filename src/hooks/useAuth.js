import { useState, useEffect, useCallback } from 'react'
import { loginUser } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Cargar usuario al inicio
  useEffect(() => {
    const savedUser = localStorage.getItem('codeflow_user')
    console.log('📄 useAuth - Checking saved user:', savedUser)
    
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        console.log('✅ useAuth - User loaded from localStorage:', parsedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error('❌ useAuth - Error parsing saved user:', error)
        localStorage.removeItem('codeflow_user')
      }
    }
    
    setIsInitialized(true)
  }, [])

  const login = useCallback(async (username, pin) => {
    console.log('🔐 useAuth - Starting login process...')
    setLoading(true)
    
    try {
      const userData = await loginUser(username, pin)
      console.log('✅ useAuth - Login successful:', userData)
      
      // Guardar en localStorage
      localStorage.setItem('codeflow_user', JSON.stringify(userData))
      console.log('💾 useAuth - User saved to localStorage')
      
      // Actualizar estado inmediatamente (sin setTimeout)
      setUser(userData)
      console.log('✅ useAuth - User state updated')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ useAuth - Login failed:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    console.log('🚪 useAuth - Logging out...')
    setUser(null)
    localStorage.removeItem('codeflow_user')
  }, [])

  return { 
    user, 
    login, 
    logout, 
    loading,
    isInitialized
  }
}