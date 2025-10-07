import React, { useEffect, useRef, useState } from 'react'

const ProductScanner = ({ onClose, onProductScanned, products }) => {
  const scannerRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [lastScanned, setLastScanned] = useState('')

  useEffect(() => {
    // Simulación del scanner para desarrollo
    const handleKeyPress = (event) => {
      if (event.key === 'Enter' && scannerRef.current) {
        const randomProduct = products[Math.floor(Math.random() * products.length)]
        if (randomProduct) {
          onProductScanned(randomProduct)
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [products, onProductScanned, onClose])

  const simulateScan = () => {
    const randomProduct = products[Math.floor(Math.random() * products.length)]
    if (randomProduct) {
      onProductScanned(randomProduct)
      onClose()
    } else {
      alert('No hay productos para escanear. Agrega productos primero.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full mx-4 border border-purple-500">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white">Escanear Código de Barras</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>
        
        <div 
          ref={scannerRef} 
          className="w-full h-64 bg-gray-800 rounded-lg mb-4 overflow-hidden flex items-center justify-center border-2 border-dashed border-purple-500"
        >
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-2">📷</div>
            <p>Scanner de Código de Barras</p>
            <p className="text-sm mt-2">(Para demo: presiona ENTER o el botón)</p>
          </div>
        </div>
        
        <div className="text-center space-y-3">
          <button
            onClick={simulateScan}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            🔘 Simular Escaneo
          </button>
          
          <p className="text-sm text-gray-400">
            Escanea un código de barras o usa el botón para simular
          </p>
          
          {lastScanned && (
            <p className="text-sm bg-purple-900 text-purple-200 p-2 rounded">
              Último código: {lastScanned}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductScanner