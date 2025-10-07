import React, { useState } from 'react'
import { supabase } from '../../lib/supabase'

const Cart = ({ cart, onUpdateQuantity, onRemoveItem, user, onSaleComplete }) => {
  const [processing, setProcessing] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const total = cart.reduce((sum, item) => sum + (item.precio * item.quantity), 0)

  const processSale = async () => {
    if (cart.length === 0) return
    
    setProcessing(true)
    
    try {
      console.log('🛒 Iniciando proceso de venta...', cart)

      // Preparar items para la venta
      const items = cart.map(item => ({
        producto_id: item.id,
        nombre: item.nombre,
        cantidad: item.quantity,
        precio_unitario: item.precio,
        subtotal: item.precio * item.quantity
      }))

      console.log('📦 Items preparados:', items)

      // Registrar venta en Supabase
      const { data: ventaData, error: ventaError } = await supabase
        .from('ventas')
        .insert([
          {
            negocio_id: user.negocio_id,
            usuario_id: user.id,
            total: total,
            items: items
          }
        ])
        .select()

      if (ventaError) {
        console.error('❌ Error en venta:', ventaError)
        throw ventaError
      }

      console.log('✅ Venta registrada:', ventaData)

      // Actualizar stock de productos - UNO POR UNO para mejor debug
      const actualizaciones = []
      for (const item of cart) {
        const nuevoStock = item.stock - item.quantity
        console.log(`📊 Actualizando producto ${item.nombre}: ${item.stock} -> ${nuevoStock}`)
        
        const { data: updateData, error: updateError } = await supabase
          .from('productos')
          .update({ stock: nuevoStock })
          .eq('id', item.id)
          .select()

        if (updateError) {
          console.error(`❌ Error actualizando stock de ${item.nombre}:`, updateError)
          throw updateError
        }

        actualizaciones.push({
          producto: item.nombre,
          stockAnterior: item.stock,
          stockNuevo: nuevoStock,
          data: updateData
        })
      }

      console.log('✅ Todos los stocks actualizados:', actualizaciones)

      // Mostrar confirmación
      setShowConfirmation(true)
      
      // Esperar y limpiar
      setTimeout(() => {
        setShowConfirmation(false)
        onSaleComplete()
        console.log('🔄 Carrito limpiado, recargando productos...')
      }, 2000)
      
    } catch (error) {
      console.error('💥 Error completo procesando venta:', error)
      alert(`❌ Error al registrar la venta: ${error.message}`)
    } finally {
      setProcessing(false)
    }
  }

  if (showConfirmation) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-lg border border-green-500">
        <div className="p-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-xl font-bold text-green-400 mb-2">¡Venta Exitosa!</h3>
          <p className="text-gray-300">Total: <span className="font-bold text-white">${total}</span></p>
          <p className="text-gray-400 text-sm mt-2">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-purple-500">
      <div className="p-4 border-b border-gray-700">
        <h3 className="font-semibold text-lg text-white">🛒 Carrito de Venta</h3>
        <p className="text-gray-400 text-sm">{cart.length} productos</p>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {cart.map(item => (
          <div key={item.id} className="p-4 border-b border-gray-700 flex justify-between items-center hover:bg-gray-750">
            <div className="flex-1">
              <h4 className="font-medium text-white">{item.nombre}</h4>
              <p className="text-sm text-gray-400">${item.precio} c/u</p>
              <p className="text-xs text-purple-400">Stock: {item.stock}</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 text-white"
                >
                  -
                </button>
                <span className="font-medium text-white w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-gray-600 text-white"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="text-red-400 hover:text-red-300 p-1 transition-colors"
                title="Eliminar producto"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-bold text-white">Total:</span>
          <span className="text-lg font-bold text-purple-400">${total}</span>
        </div>
        
        <button
          onClick={processSale}
          disabled={processing || cart.length === 0}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Procesando...</span>
            </>
          ) : (
            <>
              <span>✅</span>
              <span>CONFIRMAR VENTA - ${total}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default Cart