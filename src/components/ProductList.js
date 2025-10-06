import React, { useState } from 'react';

const ProductList = ({ products, addProduct, updateStock }) => {
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      id: Date.now(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      createdAt: new Date().toLocaleDateString('es-AR')
    };
    
    addProduct(product);
    setNewProduct({ name: '', price: '', stock: '' });
    setShowForm(false);
  };

  const handleStockUpdate = (productId, newStock) => {
    updateStock(productId, parseInt(newStock));
  };

  return (
    <div className="page fade-in">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>📦 Productos</h2>
          <button 
            className="btn btn-accent btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '❌ Cancelar' : '➕ Nuevo'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Nombre del producto"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Precio"
                step="0.01"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                className="form-input"
                placeholder="Stock inicial"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              💾 Guardar Producto
            </button>
          </form>
        )}
      </div>

      <div className="product-list">
        {products.map(product => (
          <div key={product.id} className="product-item">
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>Precio: ${product.price}</p>
              <p>Stock: 
                <span className={product.stock < 5 ? 'badge badge-warning' : 'badge badge-success'}>
                  {product.stock} unidades
                </span>
              </p>
            </div>
            <div className="product-actions">
              <input
                type="number"
                style={{
                  width: '60px',
                  padding: '0.25rem',
                  border: '1px solid var(--gray-light)',
                  borderRadius: '4px'
                }}
                value={product.stock}
                onChange={(e) => handleStockUpdate(product.id, e.target.value)}
                min="0"
              />
            </div>
          </div>
        ))}
        
        {products.length === 0 && (
          <div className="card text-center">
            <p>📝 No hay productos cargados</p>
            <button 
              className="btn btn-accent mt-1"
              onClick={() => setShowForm(true)}
            >
              ➕ Agregar Primer Producto
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;