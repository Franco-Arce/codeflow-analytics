import { useState, useEffect } from 'react'
import { loginUser } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('codeflow_user')
    console.log('🔄 useAuth - Checking saved user:', savedUser)
    
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

  const login = async (username, pin) => {
    console.log('🔐 useAuth - Starting login process...')
    setLoading(true)
    try {
      const userData = await loginUser(username, pin)
      console.log('✅ useAuth - Login successful, setting user:', userData)
      
      // Asegurar que la actualización se procese
      await new Promise(resolve => {
        setUser(userData)
        setTimeout(resolve, 0) // Forzar ciclo de actualización
      })
      
      localStorage.setItem('codeflow_user', JSON.stringify(userData))
      console.log('💾 useAuth - User saved to localStorage')
      
      return { success: true, user: userData }
    } catch (error) {
      console.error('❌ useAuth - Login failed:', error)
      return { success: false, error: error.message }
    } finally {
      setLoading(false)
      console.log('⚡ useAuth - Loading state set to false')
    }
  }

  const logout = () => {
    console.log('🚪 useAuth - Logging out...')
    setUser(null)
    localStorage.removeItem('codeflow_user')
  }

  return { 
    user, 
    login, 
    logout, 
    loading,
    isInitialized
  }
}