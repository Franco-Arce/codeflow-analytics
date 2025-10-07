import React from 'react'

const Navigation = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'sales', label: '🛒 Vender', icon: '🛒' },
    { id: 'products', label: '📦 Productos', icon: '📦' },
    { id: 'analytics', label: '📊 Análisis', icon: '📊' },
  ]

  return (
    <div className="bg-gray-800 border-t border-gray-700 fixed bottom-0 left-0 right-0">
      <div className="max-w-md mx-auto">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 py-3 text-center font-medium transition-colors ${
                currentTab === tab.id
                  ? 'text-purple-400 border-t-2 border-purple-400 bg-gray-900'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <div className="text-lg">{tab.icon}</div>
              <div className="text-xs mt-1">{tab.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Navigation