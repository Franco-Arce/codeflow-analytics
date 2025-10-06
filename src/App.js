import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import SalesForm from './components/SalesForm';
import ProductList from './components/ProductList';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ventas');
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedProducts = localStorage.getItem('codeflow-products');
    const savedSales = localStorage.getItem('codeflow-sales');
    
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
  }, []);

  // Guardar en localStorage cuando cambian los datos
  useEffect(() => {
    localStorage.setItem('codeflow-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('codeflow-sales', JSON.stringify(sales));
  }, [sales]);

  const addProduct = (product) => {
    setProducts([...products, product]);
  };

  const updateStock = (productId, newStock) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, stock: newStock } : p
    ));
  };

  const addSale = (sale) => {
    // Actualizar stock del producto
    setProducts(products.map(p => 
      p.id === sale.productId 
        ? { ...p, stock: p.stock - sale.quantity }
        : p
    ));
    
    setSales([...sales, sale]);
  };

  const renderActiveTab = () => {
    switch(activeTab) {
      case 'ventas':
        return <SalesForm products={products} addSale={addSale} />;
      case 'productos':
        return <ProductList products={products} addProduct={addProduct} updateStock={updateStock} />;
      case 'dashboard':
        return <Dashboard products={products} sales={sales} />;
      default:
        return <SalesForm products={products} addSale={addSale} />;
    }
  };

  return (
    <div className="app">
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      {renderActiveTab()}
    </div>
  );
}

export default App;