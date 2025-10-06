import React from 'react';

const Dashboard = ({ products, sales }) => {
  const totalVentas = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalVentasCount = sales.length;
  const productosBajoStock = products.filter(p => p.stock < 5).length;
  const productoMasVendido = sales.length > 0 
    ? sales.reduce((max, sale) => 
        sales.filter(s => s.productId === max.productId).length > 
        sales.filter(s => s.productId === sale.productId).length 
          ? max : sale
      ).productName 
    : 'N/A';

  const ventasHoy = sales.filter(sale => {
    const saleDate = new Date(sale.timestamp);
    const today = new Date();
    return saleDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="page fade-in">
      <div className="card">
        <h2>📈 Dashboard CodeFlow</h2>
        <p>Resumen en tiempo real de tu negocio</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">${totalVentas}</div>
          <div className="stat-label">Ventas Totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalVentasCount}</div>
          <div className="stat-label">Transacciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{ventasHoy}</div>
          <div className="stat-label">Ventas Hoy</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{productosBajoStock}</div>
          <div className="stat-label">Stock Bajo</div>
        </div>
      </div>

      {productosBajoStock > 0 && (
        <div className="alert alert-warning">
          ⚠️ <strong>Stock bajo:</strong> Tenés {productosBajoStock} productos con menos de 5 unidades
        </div>
      )}

      <div className="card">
        <h2>🏆 Producto Estrella</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)' }}>
          {productoMasVendido}
        </p>
      </div>

      <div className="card">
        <h2>📊 Últimas Ventas</h2>
        {sales.slice(-5).reverse().map(sale => (
          <div key={sale.id} style={{
            padding: '0.75rem',
            borderBottom: '1px solid var(--gray-light)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            <div>
              <strong>{sale.productName}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                {sale.timestamp}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <strong>${sale.total}</strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                {sale.quantity} x ${sale.price}
              </div>
            </div>
          </div>
        ))}
        
        {sales.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>
            No hay ventas registradas
          </p>
        )}
      </div>

      <div className="card">
        <h2>🎯 Próximos Pasos</h2>
        <p>✅ <strong>MVP Funcionando</strong> - App móvil lista</p>
        <p>🚀 <strong>Siguiente:</strong> Conectar con Power BI</p>
        <p>💡 <strong>Ideas:</strong> Exportar datos, alertas push, más analytics</p>
      </div>
    </div>
  );
};

export default Dashboard;