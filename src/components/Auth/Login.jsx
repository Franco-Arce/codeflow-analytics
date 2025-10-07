import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'

const Login = ({ onSwitchToRegister, loading }) => { // ← Agregar loading prop
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(username, pin)
    
    if (!result.success) {
      alert(`Error: ${result.error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Mi Negocio App
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
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-purple-600 py-3 px-4 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
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