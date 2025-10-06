import React from 'react';

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navigation">
      <button 
        className={`nav-btn ${activeTab === 'ventas' ? 'active' : ''}`}
        onClick={() => setActiveTab('ventas')}
      >
        🛒 Ventas
      </button>
      <button 
        className={`nav-btn ${activeTab === 'productos' ? 'active' : ''}`}
        onClick={() => setActiveTab('productos')}
      >
        📦 Productos
      </button>
      <button 
        className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
        onClick={() => setActiveTab('dashboard')}
      >
        📈 Dashboard
      </button>
    </nav>
  );
};

export default Navigation;