import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Login = ({ onSwitchToRegister }) => {
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (pin.length !== 4) {
      alert('El PIN debe tener 4 dígitos')
      return
    }
    
    setIsLoading(true)
    console.log('🔐 Login - Attempting login for:', username)
    
    try {
      const result = await login(username, pin)
      console.log('📊 Login - Result:', result)
      
      if (!result.success) {
        alert(`Error: ${result.error}`)
      } else {
        console.log('✅ Login - Success! User should be set now')
        // No hacer nada más, el hook useAuth maneja todo
      }
    } catch (error) {
      console.error('❌ Login - Unexpected error:', error)
      alert('Error inesperado al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Codeflow Systems
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Ingresá a tu cuenta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div>
            <input
              id="pin"
              name="pin"
              type="password"
              maxLength="4"
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="PIN de 4 dígitos"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              disabled={isLoading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg bg-purple-600 py-3 px-4 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Ingresando...
                </span>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              disabled={isLoading}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors disabled:opacity-50"
            >
              ¿No tenés cuenta? Registrate
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login