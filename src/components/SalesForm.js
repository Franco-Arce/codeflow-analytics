import React, { useState } from 'react';

const SalesForm = ({ products, addSale }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const product = products.find(p => p.id === selectedProduct);
    const sale = {
      id: Date.now(),
      productId: selectedProduct,
      productName: product.name,
      quantity: parseInt(quantity),
      price: product.price,
      total: product.price * quantity,
      timestamp: new Date().toLocaleString('es-AR')
    };

    addSale(sale);
    setSelectedProduct('');
    setQuantity(1);
    
    // Feedback visual
    alert(`✅ Venta registrada: ${quantity} x ${product.name}`);
  };

  return (
    <div className="page fade-in">
      <div className="card">
        <h2>🛒 Nueva Venta</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Producto</label>
            <select 
              className="form-input"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Seleccionar producto</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad</label>
            <input
              type="number"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
            />
          </div>

          {selectedProduct && (
            <div className="alert alert-success">
              Total: ${products.find(p => p.id === selectedProduct).price * quantity}
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            ✅ Registrar Venta
          </button>
        </form>
      </div>

      <div className="card">
        <h2>💡 Cómo usar</h2>
        <p>1. Seleccioná el producto</p>
        <p>2. Ingresá la cantidad</p>
        <p>3. Tocá "Registrar Venta"</p>
        <p><strong>¡Listo! Se guarda automáticamente.</strong></p>
      </div>
    </div>
  );
};

export default SalesForm;