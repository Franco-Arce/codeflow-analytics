import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const DebugInfo = () => {
  const [status, setStatus] = useState('checking...')
  const [connectionTime, setConnectionTime] = useState(0)

  const testConnection = async () => {
    try {
      console.log('🧪 Probando conexión a Supabase...')
      const startTime = Date.now()
      
      const { data, error } = await supabase
        .from('productos')
        .select('count')
        .limit(1)

      const endTime = Date.now()
      setConnectionTime(endTime - startTime)

      if (error) throw error
      
      setStatus('✅ Conexión exitosa')
      console.log('✅ Conexión a Supabase funciona correctamente')
      
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
      console.error('❌ Error de conexión:', error)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  return (
    <div className="fixed top-4 right-4 bg-gray-800 border border-purple-500 rounded-lg p-4 text-white text-sm z-50 max-w-xs">
      <div className="font-bold mb-2">🔧 Debug Info</div>
      <div className="space-y-1">
        <div>Conexión: {status}</div>
        <div>Tiempo: {connectionTime}ms</div>
        <div>URL: {import.meta.env.VITE_SUPABASE_URL ? '✅' : '❌'}</div>
        <div>Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅' : '❌'}</div>
      </div>
      <button 
        onClick={testConnection}
        className="mt-2 bg-purple-600 px-3 py-1 rounded text-xs hover:bg-purple-700 transition-colors"
      >
        Probar Conexión
      </button>
    </div>
  )
}

export default DebugInfo