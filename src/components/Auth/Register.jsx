import React, { useState } from 'react'

const Register = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState(1)
  const [codigoNegocio, setCodigoNegocio] = useState('')
  const [negocio, setNegocio] = useState(null)
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)

  const verificarNegocio = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // Para demo
      if (codigoNegocio.startsWith('DEMO')) {
        const negocioData = {
          id: "1",
          nombre: `Negocio ${codigoNegocio}`,
          codigo: codigoNegocio
        }
        setNegocio(negocioData)
        setStep(2)
      } else {
        alert('Para demo, usa un código que empiece con "DEMO" (ej: DEMO123)')
      }
    } catch (error) {
      alert('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const completarRegistro = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert(`¡Cuenta ${username} creada! Ahora podés ingresar con admin/1234`)
      onSwitchToLogin()
    } catch (error) {
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Registrar Negocio
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Ingresá el código de tu negocio
            </p>
          </div>
          
          <form onSubmit={verificarNegocio} className="mt-8 space-y-6">
            <div>
              <input
                type="text"
                required
                className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                placeholder="Código del negocio (usa: DEMO123)"
                value={codigoNegocio}
                onChange={(e) => setCodigoNegocio(e.target.value.toUpperCase())}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-lg bg-purple-600 py-3 px-4 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verificando...' : 'Continuar'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
              >
                ¿Ya tenés cuenta? Ingresá
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">
            Crear Tu Usuario
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Negocio: {negocio?.nombre}
          </p>
        </div>
        
        <form onSubmit={completarRegistro} className="mt-8 space-y-6">
          <div>
            <input
              type="text"
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Elegí tu nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div>
            <input
              type="password"
              maxLength="4"
              required
              className="relative block w-full appearance-none rounded-lg border border-gray-600 bg-gray-800 px-3 py-3 text-white placeholder-gray-400 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
              placeholder="Creá tu PIN de 4 dígitos"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-lg bg-purple-600 py-3 px-4 text-sm font-semibold text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register