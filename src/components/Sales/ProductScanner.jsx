import React, { useState, useRef, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BarcodeScanner = ({ onProductFound, negocioId }) => {
  const [scanning, setScanning] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [error, setError] = useState('')
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  // Detener cámara al desmontar
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      setError('')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setScanning(true)
      }
    } catch (err) {
      setError('No se pudo acceder a la cámara. Usa búsqueda manual.')
      console.error('Error accediendo a cámara:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    setScanning(false)
  }

  const searchByBarcode = async (barcode) => {
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('negocio_id', negocioId)
        .eq('codigo_barras', barcode)
        .eq('activo', true)
        .single()

      if (error || !data) {
        setError('Producto no encontrado')
        return
      }

      onProductFound(data)
      setManualCode('')
      stopCamera()
    } catch (err) {
      setError('Error buscando producto')
      console.error(err)
    }
  }

  const handleManualSearch = (e) => {
    e.preventDefault()
    if (manualCode.trim()) {
      searchByBarcode(manualCode.trim())
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <h3 className="text-white font-semibold mb-3">Buscar Producto</h3>

      {/* Búsqueda Manual */}
      <form onSubmit={handleManualSearch} className="mb-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Código de barras"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Buscar
          </button>
        </div>
      </form>

      {/* Botón Escanear */}
      {!scanning ? (
        <button
          onClick={startCamera}
          className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>📷</span>
          <span>Escanear Código</span>
        </button>
      ) : (
        <div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-lg mb-2"
          />
          <button
            onClick={stopCamera}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Detener Cámara
          </button>
          <p className="text-gray-400 text-sm mt-2 text-center">
            Enfoca el código de barras
          </p>
        </div>
      )}

      {error && (
        <div className="mt-3 p-3 bg-red-900/50 border border-red-600 rounded-lg">
          <p className="text-red-200 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}

export default BarcodeScanner