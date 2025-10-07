import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ProductList = ({ user }) => {
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    codigo_barras: '',
    stock: ''
  })

  // Cargar productos desde Supabase
  useEffect(() => {
    loadProducts()
  }, [user])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('productos')
        .select('*')
        .eq('negocio_id', user.negocio_id)
        .order('nombre')

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error('Error cargando productos:', error)
      alert('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { data, error } = await supabase
        .from('productos')
        .insert([
          {
            negocio_id: user.negocio_id,
            nombre: formData.nombre,
            precio: parseFloat(formData.precio),
            codigo_barras: formData.codigo_barras || null,
            stock: parseInt(formData.stock) || 0
          }
        ])
        .select()

      if (error) throw error

      setProducts(prev => [...prev, data[0]])
      setFormData({ nombre: '', precio: '', codigo_barras: '', stock: '' })
      setShowForm(false)
      alert('✅ Producto agregado!')
    } catch (error) {
      console.error('Error agregando producto:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que querés eliminar este producto?')) {
      try {
        const { error } = await supabase
          .from('productos')
          .delete()
          .eq('id', productId)

        if (error) throw error

        setProducts(prev => prev.filter(product => product.id !== productId))
        alert('🗑️ Producto eliminado')
      } catch (error) {
        console.error('Error eliminando producto:', error)
        alert(`Error: ${error.message}`)
      }
    }
  }

  const updateStock = async (productId, nuevoStock) => {
    try {
      const { error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id', productId)

      if (error) throw error

      setProducts(prev =>
        prev.map(product =>
          product.id === productId ? { ...product, stock: nuevoStock } : product
        )
      )
    } catch (error) {
      console.error('Error actualizando stock:', error)
      alert(`Error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">📦 Productos</h1>
          <button
            onClick={() => setShowForm(true)}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            + Agregar
          </button>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-500">
            <div className="text-gray-400 text-sm">Total Productos</div>
            <div className="text-2xl font-bold text-white">{products.length}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-500">
            <div className="text-gray-400 text-sm">Stock Bajo</div>
            <div className="text-2xl font-bold text-red-400">
              {products.filter(p => p.stock < 10).length}
            </div>
          </div>
        </div>

        {/* Formulario para agregar producto */}
        {showForm && (
          <div className="bg-gray-800 rounded-lg p-4 border border-purple-500 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Agregar Producto</h3>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-white"
                disabled={loading}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nombre del producto"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.nombre}
                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                required
                disabled={loading}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Precio"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.precio}
                onChange={(e) => setFormData(prev => ({ ...prev, precio: e.target.value }))}
                required
                disabled={loading}
              />
              <input
                type="text"
                placeholder="Código de barras (opcional)"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.codigo_barras}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo_barras: e.target.value }))}
                disabled={loading}
              />
              <input
                type="number"
                placeholder="Stock inicial"
                className="w-full px-3 py-2 border border-gray-600 bg-gray-700 rounded focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                value={formData.stock}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                required
                disabled={loading}
              />
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-600 text-white py-2 rounded font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Loading State */}
        {loading && products.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        {/* Lista de productos */}
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg">{product.nombre}</h3>
                    <p className="text-xl font-bold text-purple-400">${product.precio}</p>
                    {product.codigo_barras && (
                      <p className="text-sm text-gray-400">📊 Código: {product.codigo_barras}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${product.stock < 10 ? 'text-red-400' : 'text-green-400'}`}>
                      Stock: {product.stock}
                    </p>
                  </div>
                </div>
                
                {/* Controles de stock */}
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => updateStock(product.id, product.stock - 1)}
                      disabled={product.stock <= 0}
                      className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                      -
                    </button>
                    <button
                      onClick={() => updateStock(product.id, product.stock + 1)}
                      className="w-8 h-8 rounded bg-gray-700 flex items-center justify-center hover:bg-gray-600 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Eliminar producto"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-400">
            <p>No hay productos cargados</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-2 text-purple-400 hover:text-purple-300 transition-colors"
            >
              Agregar el primer producto
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductList