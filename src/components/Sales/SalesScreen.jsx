import React, { useState, useEffect } from 'react'
import ProductScanner from './ProductScanner'
import Cart from './Cart'
import { supabase } from '../../lib/supabase'

const SalesScreen = ({ user }) => {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showScanner, setShowScanner] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

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

  const addToCart = (product) => {
    // Verificar stock disponible
    if (product.stock <= 0) {
      alert('❌ No hay stock disponible de este producto')
      return
    }

    setCart(prevCart => {
      const existing = prevCart.find(item => item.id === product.id)
      if (existing) {
        // Verificar que no exceda el stock
        if (existing.quantity + 1 > product.stock) {
          alert('❌ No hay suficiente stock disponible')
          return prevCart
        }
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    // Verificar stock disponible
    const product = products.find(p => p.id === productId)
    if (product && newQuantity > product.stock) {
      alert('❌ No hay suficiente stock disponible')
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const filteredProducts = products.filter(product =>
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">Vender</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowScanner(true)}
                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                title="Escanear código"
              >
                📷
              </button>
            </div>
          </div>
          
          {/* Buscador */}
          <div className="mt-4">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full px-4 py-3 border border-gray-600 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="max-w-md mx-auto p-4">
        {loading && (
          <div className="text-center py-8 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2"></div>
            <p>Cargando productos...</p>
          </div>
        )}

        <div className="grid gap-3">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className={`bg-gray-800 p-4 rounded-lg border transition-colors cursor-pointer ${
                product.stock > 0 
                  ? 'border-gray-700 hover:border-purple-500' 
                  : 'border-red-500 opacity-60'
              }`}
              onClick={() => product.stock > 0 && addToCart(product)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-white">{product.nombre}</h3>
                  <p className="text-lg font-bold text-purple-400">${product.precio}</p>
                  {product.codigo_barras && (
                    <p className="text-sm text-gray-400">📊 {product.codigo_barras}</p>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  product.stock === 0 ? 'text-red-400' : 
                  product.stock < 5 ? 'text-yellow-400' : 'text-green-400'
                }`}>
                  Stock: {product.stock}
                </div>
              </div>
              {product.stock === 0 && (
                <p className="text-red-400 text-sm mt-2">⛔ Sin stock</p>
              )}
            </div>
          ))}
        </div>

        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <p>No se encontraron productos</p>
            <p className="text-sm mt-2">Agrega productos en la pestaña "Productos"</p>
          </div>
        )}
      </div>

      {/* Carrito Flotante */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-gray-800 border-t border-gray-700">
          <div className="max-w-md mx-auto p-4">
            <Cart
              cart={cart}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              user={user}
              onSaleComplete={() => {
                setCart([])
                loadProducts() // Recargar productos para actualizar stock
              }}
            />
          </div>
        </div>
      )}

      {/* Scanner Modal */}
      {showScanner && (
        <ProductScanner
          onClose={() => setShowScanner(false)}
          onProductScanned={(product) => {
            if (product.stock > 0) {
              addToCart(product)
            } else {
              alert('❌ Producto sin stock disponible')
            }
            setShowScanner(false)
          }}
          products={products}
        />
      )}
    </div>
  )
}

export default SalesScreen